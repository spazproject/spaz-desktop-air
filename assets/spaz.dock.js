if (!Spaz.Dock) Spaz.Dock = {};

/***********
Spaz.Dock takes care of modifying the OS X dock icon
***********/

/* Initiliaze everything.
 */
Spaz.Dock.init = function() {

   // Only on OSX
   Spaz.Dock.active = air.NativeApplication.supportsDockIcon;

   //
   if (!Spaz.Dock.active)
   {
      return;
   }

   // Load the image async
   var imageURL = 'images/spaz-icon-alpha.png';
   air.trace("Want to load image " + imageURL);
   var loader = new air.Loader();
   loader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, function(event)
   {
      air.trace("Loaded image " + imageURL);
      Spaz.Dock.bitmapData = event.target.content.bitmapData;
   }, false, 0, true);
   loader.load(new air.URLRequest(imageURL));

   // Save for later use
   Spaz.Dock.icon = air.NativeApplication.nativeApplication.icon;

   //
   Spaz.Dock.sync();
}

Spaz.Dock.cache = {};

Spaz.Dock.colorMap = {
   "red": {"high":0xFF0000, "low":0xAA0000, "border":0x660000},
   "blue": {"high":0xFF, "low":0xAA, "border":0x66},
   "yellow": {"high":0xFFFF00, "low":0xAAAA00, "border":0x666600},
   "green": {"high":0xFF00, "low":0xAA00, "border":0x6600},
   "cyan": {"high":0xFFFF, "low":0xAAAA, "border":0x6666},
   "magenta": {"high":0xFF00FF, "low":0xAA00AA, "border":0x660066}
}

Spaz.Dock.setColor = function(color)
{
   if (typeof color == 'undefined' || Spaz.Dock.colorMap[color] == null)
   {
      color = "red";
   }
   Spaz.Dock.color = color;
}

Spaz.Dock.getColor = function()
{
   var color = Spaz.Dock.color;
   if (color == null)
   {
      color = "red";
   }
   return color;
}

Spaz.Dock.shapeMap = {
   "classic" : function(unreadCount, color) {
      return new Spaz.Dock.ClassicBadge(unreadCount, color)
   },
   "star" : function(unreadCount, color) {
      return new Spaz.Dock.StarBadge(unreadCount, color)
   }
};

Spaz.Dock.setShape = function(shape) {
   if (typeof shape == 'undefined' || Spaz.Dock.shapeMap[shape] == null)
   {
      shape = "classic";
   }
   Spaz.Dock.shape = shape;
}

Spaz.Dock.getShape = function() {
   var shape = Spaz.Dock.shape;
   if (shape == null)
   {
      shape = "classic";
   }
   return shape;
}

/* Synchronize the dock with its the prefs. It also takes care of starting/stopping the refresh thread.
 */
Spaz.Dock.sync = function()
{
   if (!Spaz.Dock.active)
   {
      return;
   }

   //
   var reloadID = Spaz.Dock.reloadID;
   if (reloadID != null)
   {
      air.trace("Stopping dock refresh thread");
      window.clearInterval(reloadID);
   }
   if (Spaz.Prefs.getDockDisplayUnreadBadge())
   {
      var refresh = Spaz.Prefs.getDockRefreshInterval();
      air.trace("Starting dock refresh thread with refresh rate of " + refresh + " ms");
      Spaz.Dock.reloadID = window.setInterval(Spaz.Dock.refresh, refresh);
   }
}

/* Performs a visual refresh. The unreadCount argument is optional. If it is not provided
 * then the value will be computed from the div elements non marked as read in the timeline of friends.
 */
Spaz.Dock.refresh = function(unreadCount)
{
   if (!Spaz.Dock.active)
   {
      return;
   }

   // Maybe image has not been loaded yet, we want to avoid this case (it happens during the startup)
   if (Spaz.Dock.bitmapData == null)
   {
      return;
   }

   //
   if (typeof unreadCount == 'undefined')
   {
      unreadCount = Spaz.UI.getUnreadCount();
   }
   var color = Spaz.Dock.getColor();
   var shape = Spaz.Dock.getShape();

   //
   if (unreadCount == Spaz.Dock.cache.lastUnreadCount &&
       color == Spaz.Dock.cache.color &&
       shape == Spaz.Dock.cache.shape)
   {
      return;
   }

   // Use the original icon if count is zero
   if (unreadCount == 0)
   {
      // Update state
      Spaz.Dock.icon.bitmaps = [Spaz.Dock.bitmapData];
      Spaz.Dock.lastUnreadCount = 0;
      return;
   }

   // Get the badge object
   var badge = Spaz.Dock.shapeMap[shape](unreadCount, color);

   // Clone the bitmap and draw
   var clonedBitmap = Spaz.Dock.bitmapData.clone();
   badge.draw(clonedBitmap);

   // Update state
   Spaz.Dock.cache.lastUnreadCount = unreadCount;
   Spaz.Dock.cache.color = color;
   Spaz.Dock.cache.shape = shape;
   Spaz.Dock.icon.bitmaps = [clonedBitmap];
}

/* Precomputes palette map used in the text rasterizer.
 */
Spaz.Dock.paletteMap1 = function() {
   var array = [0];
   for (var i = 1;i < 256;i++)
   {
      array.push(0xFFFFFFFF);
   }
   return array;
}();
Spaz.Dock.paletteMap2 = function() {
   var array = [0];
   for (var i = 1;i < 256;i++)
   {
      array.push(0);
   }
   return array;
}();

/*  The text rasterizer.
 */
Spaz.Dock.TextRasterizer = function(text)
{
   var format = new window.runtime.flash.text.TextFormat();
   format.size = 25;
   format.color = 0xFFFFFF;
   format.bold = true;
   format.font = 'Arial';

   //
   var tf = new window.runtime.flash.text.TextField();
   tf.defaultTextFormat = format;
   tf.text = text;
   tf.wordWrap = true;

   // Draw the text in a buffer
   var bitmapData = new window.runtime.flash.display.BitmapData(
      256,
      256,
      true,
      0x000000);
   bitmapData.draw(tf);

   // Create a bitmap will all pixel being either white or black in order to
   // have the maximum detection of the bounding box
   var tmp = new window.runtime.flash.display.BitmapData(256, 256, true, 0x000000)
   tmp.paletteMap(
      bitmapData,
      new window.runtime.flash.geom.Rectangle(0, 0, 256, 256),
      new window.runtime.flash.geom.Point(0, 0),
      Spaz.Dock.paletteMap1,
      Spaz.Dock.paletteMap2,
      Spaz.Dock.paletteMap2,
      Spaz.Dock.paletteMap2
      );

   // Compute the bounding box, we cannot use TextField.textWidth and TextField.textHeight as
   // they return approximation which results into incorrect display
   var rect = tmp.getColorBoundsRect(0xFFFFFFFF, 0xFFFFFFFF, true);

   // Now crop the text using the bounding box
   var width = rect.width ;
   var height = rect.height;
   var croppedBitmapData = new window.runtime.flash.display.BitmapData(width, height);
   croppedBitmapData.copyPixels(
      bitmapData,
      rect,
      new window.runtime.flash.geom.Point(0, 0));

   //
   this.width = width;
   this.height = height;
   this.bitmapData = croppedBitmapData;
}

/* A badge for drawing a star. The text size will vary and the star size remains constant.
 */
Spaz.Dock.StarBadge = function(unreadCount, color)
{
   var star = new Spaz.Dock.Star(32, Spaz.Dock.colorMap[color]);
   var text = new Spaz.Dock.TextRasterizer("" + unreadCount);

   // A bit smaller than the inner circle
   var r = star.innerRadius * 0.86;

   // Compute the text box inside the shape
   var alpha = Math.atan(text.height / text.width);
   var xmin = star.width / 2 - r * Math.cos(alpha);
   var ymin = star.height / 2 - r * Math.sin(alpha);
   var xmax = star.width / 2 + r* Math.cos(alpha);
   var ymax = star.height / 2 + r * Math.sin(alpha);

   // Create the transformation matrix to fit the text in the shape
   var m = new window.runtime.flash.geom.Matrix();
   m.scale((xmax - xmin) / (text.width),(ymax - ymin) / (text.height));
   m.translate(xmin, ymin);

   //
   this.draw = function(bitmapData) {
      bitmapData.draw(star.shape);
      bitmapData.draw(text.bitmapData, m);
   };
}

/* The star object wrapps a flash shape and adds additional meta data such as the width, height
 * inner radius and outter radius. */
Spaz.Dock.Star = function(outterRadius, colors)
{
   getInnerRadius = function(r)
   {
      return (r * (3 - Math.sqrt(5))) / 2; // ratio (3-sqrt(5)) / 2, related to Golden Number
   }
   getOutterRadius = function(r)
   {
      return (r * 2) / (3 - Math.sqrt(5)); // ratio 2 / (3-sqrt(5)), related to Golden Number
   }

   //
   var shape = new window.runtime.flash.display.Shape();
   var innerRadius = getInnerRadius(outterRadius);

   //
   Spaz.Dock.drawPolygon(shape.graphics, outterRadius, outterRadius, innerRadius, innerRadius, outterRadius, outterRadius, 5, colors);

   //
   this.shape = shape;
   this.innerRadius = innerRadius;
   this.outterRadius = outterRadius;
   this.width = outterRadius * 2;
   this.height = outterRadius * 2;
};

/* The classic badge has a fixed fonts size and the shape around the text will have a variable size. */
Spaz.Dock.ClassicBadge = function(unreadCount, color)
{
   var text = new Spaz.Dock.TextRasterizer("" + unreadCount);

   //
   var shape = Spaz.Dock.createShape(
      text.width,
      text.height,
      12,
      5,
      Spaz.Dock.colorMap[color]);

   //
   this.draw = function(bitmapData)
   {
      //
      bitmapData.draw(shape);

      // Copy the text on top of the shape
      bitmapData.copyPixels(
         text.bitmapData,
         new window.runtime.flash.geom.Rectangle(0, 0, text.width, text.height),
         new window.runtime.flash.geom.Point((shape.width - text.width) / 2, (shape.height - text.height) / 2),
         null,
         null,
         true);
   };
}

/* The classic shape. */
Spaz.Dock.createShape = function(width, height, padding, border, colors)
{
   // Compute the ellipse dimensions
   var eW = (width * (Math.sqrt(2)));
   var eH = (height * (Math.sqrt(2)));

   // Correct the dimension if the ellipse width is lesser than the ellipse height
   if (eW < eH)
   {
      eW = eH;
   }

   // Compute the inner and outter ellipses
   var innerW = eW + padding;
   var innerH = eH + padding;
   var outterW = eW + padding + border;
   var outterH = eH + padding + border;

   // Draw the shape
   var shape = new window.runtime.flash.display.Shape();

   // Compute perimeter
   var perimeter = Math.PI * (outterW / 2) * (outterH / 2);

   // For debugging purposes
//   shape.graphics.beginFill(colors.low);
//   shape.graphics.drawEllipse(0, 0, outterW, outterH);
//   shape.graphics.beginFill(colors.high);
//   shape.graphics.drawEllipse((outterW - innerW) / 2, (outterH - innerH) / 2, innerW, innerH);

   //
   Spaz.Dock.drawPolygon(
   shape.graphics,
   outterW / 2,
   outterH / 2,
   innerW / 2,
   innerH / 2,
   outterW / 2,
   outterH / 2,
   perimeter / 50,
   colors);

   //
   return shape;
}


/* Draw a star polygon on the specified graphics.
 * graphics: the graphics
 * centerX: the x coordinate of the center of the polygon
 * centerY: the y coordinate of the center of the polygon
 * innerW: the width of the inner ellipse
 * innerH: the height of the inner ellipse
 * outterW: the width of the outter ellipse
 * outterH: the height of the outter ellipse
 * size: the number of branch in the star
 */
Spaz.Dock.drawPolygon = function(graphics, centerX, centerY, innerW, innerH, outterW, outterH, size, colors)
{
   var delta = (Math.PI * 2) / size;
   var angle = 0;
   var xs = [];
   var ys = [];
   for (var i = 0;i < size;i++)
   {
      angle = delta * i + (Math.PI / 2);
      var x1 = centerX + outterW * Math.cos(angle);
      var y1 = centerY - outterH * Math.sin(angle);
      angle += delta / 2;
      var x2 = centerX + innerW * Math.cos(angle);
      var y2 = centerY - innerH * Math.sin(angle);

      //
      xs.push(x1);
      ys.push(y1);
      xs.push(x2);
      ys.push(y2);
   }

   // Draw the inner
   var fillType = window.runtime.flash.display.GradientType.LINEAR;
   var alphas = [1, 1];
   var ratios = [0x00, 0xFF];
   var matr = new window.runtime.flash.geom.Matrix();
   matr.createGradientBox(outterW * 2, 0, 0, 0, 0);
   var spreadMethod = window.runtime.flash.display.SpreadMethod.PAD;
   graphics.beginGradientFill(fillType, [colors.high, colors.low], alphas, ratios, matr, spreadMethod);

   //
   graphics.lineStyle(
      0,
      colors.border,
      1,
      false,
      window.runtime.flash.display.LineScaleMode.NORMAL,
      window.runtime.flash.display.CapsStyle.NONE,
      window.runtime.flash.display.JointStyle.MITER,
      3);

   //
   for (var j in xs)
   {
      if (j == 0)
      {
         graphics.moveTo(xs[j], ys[j]);
      }
      else
      {
         graphics.lineTo(xs[j], ys[j]);
      }
   }

   //
   graphics.endFill();
}

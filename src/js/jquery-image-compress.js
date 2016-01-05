'use strict';
(function($) {
  $.extend({
    readAsDataURL: function(blob, callback) {
      var a = new FileReader();
      a.onload = function(e) {
        callback(e.target.result);
      };
      a.readAsDataURL(blob);
    },
    dataURLtoBlob: function(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },
    imageCompress: function() {
      var file;
      var callback;
      var options={};
      if(arguments.length<2){
        return console.error('at least 2 arguments needed');
      }
      if(arguments.length==2){
        file=arguments[0];
        callback=arguments[1];
      }
      if(arguments.length==3){
        file=arguments[0];
        options=arguments[1];
        callback=arguments[2];
      }
      if(!file){
        return console.error('file is null');
      }
      //blob,file转dataURL
      var readBlobAsDataURL = function(blob, callback) {
          var a = new FileReader();
          a.onload = function(e) {
            callback(e.target.result);
          };
          a.readAsDataURL(blob);
        }
        //dataURL转blob
      var dataURLtoBlob = function(dataurl) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
          type: mime
        });
      }

      function compress(img,quality) {
      	var quality=quality||0.1;
        var initSize = img.src.length;
        var width = img.width;
        var height = img.height;
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        var ratio;
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio);
          width /= ratio;
          height /= ratio;
        } else {
          ratio = 1;
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        //  铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片像素大于100万则使用瓦片绘制
        var count;
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
          //      计算每块瓦片的宽和高
          var nw = ~~(width / count);
          var nh = ~~(height / count);
          var tCanvas = document.createElement('canvas');
          var tctx = tCanvas.getContext("2d");
          tCanvas.width = nw;
          tCanvas.height = nh;
          for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }
        //进行最小压缩
        var ndata = canvas.toDataURL('image/jpeg', quality);
        console.log('压缩前：' + initSize);
        console.log('压缩后：' + ndata.length);
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
        // tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
      }

      var default_options={
        quality:0.1
      }
      var options=$.extend(default_options,options);
      readBlobAsDataURL(file, function(data_url) {
        var image = new Image();
        image.src = data_url;
        var result = compress(image,options.quality);
        callback(result);
      })
    }
  })
})(jQuery);

import { Component } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { DomSanitizer } from "@angular/platform-browser";
import { Base64 } from "@ionic-native/base64/ngx";
import { File } from "@ionic-native/file/ngx";

declare const window: any;
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  public imgUrl: any;

  constructor(
    private camera: Camera,
    private webView: WebView,
    public _dom: DomSanitizer,
    private _base64: Base64,
    private _file: File
  ) {}

  takePicture(source: string) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    if (source == "1") {
      options.sourceType = this.camera.PictureSourceType.CAMERA;
    } else if (source == "2") {
      options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    }
    this.camera.getPicture(options).then(
      async imageData => {
        console.log(this.webView.convertFileSrc(imageData), "convertFileSrc");
        this.imgUrl = this.webView.convertFileSrc(imageData);
        alert(this.webView.convertFileSrc(imageData));
        console.log(imageData, "imageData");
        alert(imageData);
        let blob = await fetch(this.webView.convertFileSrc(imageData)).then(r =>
          r.blob()
        );
        console.log(blob, "blob");
        alert(blob);
        this._base64.encodeFile(imageData).then(base64str => {
          console.log(base64str);
          alert(base64str);
        });

        window.resolveLocalFileSystemURL(imageData, fileEntry => {
          fileEntry.file(file => {
            console.log(file, "window file");
            alert(file + "window file");
            console.log(file.localURL, "localUrl");
            this._base64
              .encodeFile(file.localURL)
              .then(base64LocalURL => {
                console.log(base64LocalURL, "base64LocalUrl");
              })
              .catch(e => console.log(e, "base64localError"));
          });
        });

        // if (imageData.indexOf("file://") == -1) {
        //   imageData = "file://" + imageData;
        // }
        this._file.resolveLocalFilesystemUrl(imageData).then(entry => {
          console.log(entry);
          alert("entry" + entry);
          // console.log(
          //   entry.toInternalURL(),
          //   entry.toURL(),
          //   entry.fullPath,
          //   entry.nativeURL
          // );
          // if (imageData.indexOf("file://") == -1) {
          //   imageData = "file://" + imageData;
          // }

          // entry.file(rfile => {
          //   console.log(rfile, "real file");
          //   alert("real file" + rfile);
          // });
        });
      },
      err => {
        console.log(err);
      }
    );
  }
}

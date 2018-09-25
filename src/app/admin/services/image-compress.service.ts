import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Injectable({
  providedIn: 'root'
})
export class ImageCompressService {

  private fileToUpload: File[] = [];

  constructor(private ng2ImgMax: Ng2ImgMaxService) { }

  imageResize(image: File, width?: number, height?: number): Observable<File> {
    const _width = width ? width : 355;
    const _height = height ? height : 355;

    return this.ng2ImgMax.resizeImage(image, _width, _height);
  }

  imageCompress(image: File, size?: number): Observable<File> {
    const _size = size ? (size / 1024) :  0.050;

    return this.ng2ImgMax.compressImage(image, _size);
  }
}

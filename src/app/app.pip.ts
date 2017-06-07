import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'imageView' })

export class ImageView implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(url: string): string {
    if (-1 != url.indexOf("http://") || -1 != url.indexOf("https://")) {
      //let thumbnails_path = url.substring(0, url.indexOf("?")) + "_lim";
      let suffix = url.substring(url.indexOf("&suffix=") + 8, url.length) + "?";
      let thumbnails_path = url.replace(suffix, "_lim" + suffix);
      return thumbnails_path;
    }
    return url;
  }
}

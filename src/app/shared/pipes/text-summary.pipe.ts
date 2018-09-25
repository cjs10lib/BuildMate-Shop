import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class TextSummaryPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value) { return null; }

    const length = args ? args : 35;
    return value.substr(0, length) + '...';
  }

}

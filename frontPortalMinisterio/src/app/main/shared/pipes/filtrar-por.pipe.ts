import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarPor'
})
export class FiltrarPorPipe implements PipeTransform {

  transform(values: any[], filters: any[], filter:string): any[] {
    let keys:any[] = !Array.isArray(filters) ? [filters] : filters;

    return values.filter(item => {
      return keys.some((keyName) => {
        return new RegExp(filter, 'gi').test(item[keyName]);
      });
    });
  }

}

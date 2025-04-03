import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// DEFINICION DE PIPES
// Los pipes son interceptores que se utilizan para transformar los datos que se reciben en un endpoint.

// CUSTOMIZAMOS PIPES
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    
    //console.log({value, metadata});
    
    // si el valor no es un mongoID, entonces lanzamos un error.
    if ( !isValidObjectId(value) ){
      throw new BadRequestException(`${ value } is not a valid MongoID`);
    }


    return value; // si es un mongoID, lo devolvemos tal cual.
  }
}
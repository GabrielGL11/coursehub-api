import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
    export class ParseStudentIdPipe implements PipeTransform {
    transform(value: string) {
        const id = Number(value);

        if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
        throw new BadRequestException('El ID debe ser un número entero positivo');
        }

        return id;
    }
}
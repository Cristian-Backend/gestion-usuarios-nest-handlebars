import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export  class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number; // offset es el numero de registros que se va a saltar
}
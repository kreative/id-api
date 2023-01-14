import { 
  BadRequestException,
  ForbiddenException, 
  InternalServerErrorException, 
  NotFoundException
} from "@nestjs/common";

import { 
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError, 
  PrismaClientUnknownRequestError, 
  PrismaClientValidationError 
} from "@prisma/client/runtime";

// handles different prisma errors and sends a response
export function handlePrismaErrors(error: any, message?: string): void {
  
  // handles errors of PrismaClientKnownRequestError
  if (error instanceof PrismaClientKnownRequestError) {
    console.log(error);

    if (error.code === "P2002") {
      // retrieve the field that isn't meeting unique constraint error
      const target: string = error.meta.target[0];
      throw new ForbiddenException(`unique constraint failed for ${target}`);
    }
    else if (error.code === "P2003") {
      // foreign key constraint fails
      throw new BadRequestException("failed foreign key constraint");
    }
    else if (error.code === "P2025") {
      // there was no account found with the unique field
      throw new NotFoundException(message);
    }
    else {
      // responds to all other errors as a 'catch-all'
      throw new InternalServerErrorException();
    }
  }

  // handles errors of PrismaClientUnknownRequestError
  // and handles errors of if the underlying engine/system crashes
  if (error instanceof (PrismaClientUnknownRequestError || PrismaClientRustPanicError)) {
    console.log(error);
    throw new InternalServerErrorException();
  }
  
  // handles errors of the database and query engine initializing
  if (error instanceof PrismaClientInitializationError) {
    console.log(error);
    throw new InternalServerErrorException()
  }

  // handles errors of PrismaClientValidationError
  if (error instanceof PrismaClientValidationError) {
    console.log(error);
    throw new BadRequestException();
  }
}
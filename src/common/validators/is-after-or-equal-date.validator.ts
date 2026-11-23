import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfterOrEqualDate', async: false })
export class IsAfterOrEqualDateConstraint
  implements ValidatorConstraintInterface
{
  validate(propertyValue: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    // If either is missing, let required/date validators handle the presence check
    if (!propertyValue || !relatedValue) {
      return true;
    }

    const currentDate = new Date(propertyValue);
    const relatedDate = new Date(relatedValue);

    if (isNaN(currentDate.getTime()) || isNaN(relatedDate.getTime())) {
      return false;
    }

    return currentDate >= relatedDate;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be equal to or after ${relatedPropertyName}`;
  }
}

export function IsAfterOrEqualDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterOrEqualDateConstraint,
    });
  };
}

- All source code are on src folder.

## ROUTES: route folder contains all routing and endpoints.

- Routes defined: Tours,Auth,

## CONTROLLERS: Contains handler function for each routes with respect to their HTTP methods.

## MIDDLEWARES: Contains middlewares ;

API :

query: limitFields: name,price,etc , in case of multiple query they must be seperated by comma

# KEY NOTES

- Some validation works only for save(create) method, so while updating docs we are using doc.save() method not findByIdAndUpdate method.
- User has passwordChangedAt field, whenever user changes password we goanna update it.

## Routes Structure

//=> Reviews:

- Only authenticated users (not admin/guides/lead-guide) are allowed to create a review.

//@ INCOMPLETE-

- password reset , forgot password functionality.
- tour stats controller
- xss security

- -user section
- update details, delete account,

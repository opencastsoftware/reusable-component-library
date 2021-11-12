# Description
Checks if a data object conforms to the given template and throws an error if one of the following violations is found.

- Mandatory property is missing
- Property does not meet tempalte definition.

Please see [here](https://opencastsoftware.atlassian.net/wiki/spaces/SD/pages/2563539019/Validator) for further documentation.

# Usage
*new validator().validate(data, template, isUpdate)*

"data" is the data to validate.

"template" is the template to validate against.

"isUpdate" specifies whether or not to ignore missing properties. This defaults to false if unspecified and (if true) specifies that you are validating an update object where missing properties mean unchanged propoerties.

# Dependency
`npm install validator`

# Author
[Patrick Lucas](patrick.lucas@opencastsoftware.com)

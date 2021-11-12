# Description
Compares two objects ("old" and "new") and returns an object containing the prooperties found in "new" one of the following is met.

- Property does not exist in "old"
- Value is different to that in "old"

The comparaision is fully recursive which means that properties can be objects in their own right. See unit tests for an exaamole of this.

# Usage
*const diff = new Comparator().compare(old, new)*

# Author
[Patrick Lucas](patrick.lucas@opencastsoftware.com)

This houses components that can be reused across Opencast projects. Feel free to add items that you think may be useful outside the project you are working. Please make sure that any items,s you do add are designed to be generic and are decoupled from the project you are working on. Ask yourself the question "Can what I am working in be useful outside my project and if so how much work is it to make it generic?".

Apart from the "main" brnch, this repository contains a branch for each language as listed below.

- Java
- JavaScript
- Python
- Scala

Please checkout the branch corresponding to the language you are using. If you need a new branch then plese create it.

Once you have ckecked out your language branch, please create a folder for your component usiung a descriptive name. Tghis folder needs to contain the following.

- The component itself.
- A unit test file (with the word "test" in its name) containing
  a comment as to what framework to setup (e.g. JUnit, Jest).
- A README.md file describing how to setup/use the component and
  containing a link to the component documentation on Confluence
  (if the component is too complex to document in this file).
  This also needs to contain ancontact e-mail so developers who
  wish to use your component can contact you with questions.


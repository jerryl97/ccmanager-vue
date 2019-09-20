# Multiple Credit Card Management Application(ccmanager)

<br>

## About:
<p>This application functions primarily as an expense manager, it is made up of 3 main components:</p>
<ul>
  <li><b>Accounts:<b/> represents credit cards/payment methods. Example: Credit Card, Debit Card, Cash account types</li>
  <li><b>Transactions:<b/> represents expense and income flow saved within the application. Example: Expense, Income, Transfer transaction types</li>
  <li><b>Promotions:<b/> used for recommendation feature that advices users on which Account to use for a Expense Transaction.</li>
</ul>

<br>

## Development Build Setup Guide:
<ul>
  <li>Adding Cordova into Vue Project - https://github.com/m0dch3n/vue-cli-plugin-cordova</li>
  <li>ccmanager dependencies:
    <ul>
      <li>Lodash - https://github.com/lodash/lodash</li>
      <li>Local Forage - https://github.com/localForage/localForage</li>
      <li>Vant - https://github.com/youzan/vant</li>
      <li>Router - https://router.vuejs.org/installation.html#npm</li>
      <li>Vue moment - https://github.com/brockpetrie/vue-moment?ref=madewithvuejs.com</li>
      <li>Vue Floating Point Button - https://www.npmjs.com/package/vue-float-action-button</li>
      <li>Vuex Store - https://vuex.vuejs.org/installation.html</li>
    </ul>
  </li>
  <li>Potential plugins to be added in:
    <ul>
      <li>Data Visualization(chart.js) - https://www.chartjs.org</li>
      <ul>
        <lh>Cordova Plugins reguire vue-clie-plugin-cordova to be added into the project</lh>
        <li>Card IO(OCR) - https://developers.braintreepayments.com/</li>
        <li>Local Notification - https://github.com/katzer/cordova-plugin-local-notifications</li>
        <li>Create local backup json file - https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/</li>
      </ul>
    </ul>
  </li>
</ul>

<br>

## Command Lines Guide:
```
vue create ccmanager
cd ccmanager
npm i lodash
npm install localforage
npm i vant -S
npm install vue-router
npm install vue-moment
npm install vue-float-action-button
npm install vuex --save
npm run serve
```
## Extra Features and Plugins:
```
npm install chart.js --save
vue add cordova
npm cordova-build-android
cd src-cordova
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-local-notification
cordova plugin add https://github.com/card-io/card.io-Cordova-Plugin
cordova run android
```

<br>

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

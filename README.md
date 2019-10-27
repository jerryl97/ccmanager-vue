# Multiple Credit Card Management Application(ccmanager)

<br>

<p>GitHub Webpage: <a href="https://github.com/jerryl97/ccmanager-vue">HERE</a></p>
<p>Download the Android APK: <a href="https://github.com/jerryl97/ccmanager-vue/releases/download/1.0/ccmanager.apk">HERE</a></p>

<br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/23553138/65384809-60f4e200-dd59-11e9-9f34-5024639c9888.PNG">
</p>

## About:
<p>This application functions primarily as an expense manager, it is made up of 3 main components:</p>
<ul>
  <li>Accounts:<br/>
    Represents credit cards/payment methods.<br/>
    Example: Credit Card, Debit Card, Cash account types</li>
  <li>Transactions:<br/>
    Represents expense and income flow saved within the application.<br/>
    Example: Expense, Income, Transfer transaction types</li>
  <li>Promotions:<br/>
    Used for recommendation feature that advices users on which Account to use for a Expense Transaction.</li>
</ul>

<p>Recommendation feature primarily relies on 2 main factors:</p>
<ul>
  <li>
    Requirements:
    <ul>
      <li>Minimum Spending</li>
      <li>Valid Period</li>
      <li>Related Accounts</li>
      <li>Related Expense</li>
    </ul>
  </li>
  <li>
    Rewards:
    <ul>
      <li>Cashback</li>
      <li>Discount</li>
      <li>Others</li>
    </ul>
  </li>
 </ul>
<p>
  Requirements acts as a <b>filter</b> for only showing relevant Accounts for recommendation.<br/>
  Rewards will act as the <b>weight</b> for the determining which Promotion is more significant.
</p>

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
      <li>Cordova Plugins require vue-cli-plugin-cordova to be added into the project</li>
      <ul>
        <li>Card IO(OCR) - https://github.com/card-io/card.io-Cordova-Plugin</li>
        <li>Local Notification - https://github.com/katzer/cordova-plugin-local-notifications</li>
        <li>Create local backup json file - https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/</li>
      </ul>
    </ul>
  </li>
</ul>

<br>

## Project setup
```
npm install //Install the npm modules
npm run cordova-prepare //Prepare for cordova
```

### Compiles and hot-reloads for development
```
npm run serve //Development on Browser
npm run cordova-serve-android //Development on Android
```

### Compiles and minifies for production
```
npm run build
npm run cordova-build-android //Build Android
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

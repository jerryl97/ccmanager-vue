# Multiple Credit Card Management Application(ccmanager)


## Development Build Setup Guide

<h2>Development build setup guide:</h2>
<ul>
  <li>https://github.com/m0dch3n/vue-cli-plugin-cordova - vue add cordova</li>
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
      <li>Card IO(OCR) - https://developers.braintreepayments.com/</li>
      <li>Local Notification - https://github.com/katzer/cordova-plugin-local-notifications</li>
      <li>Create local backup json file - https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/</li>
    </ul>
  </li>
</ul>

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
```

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

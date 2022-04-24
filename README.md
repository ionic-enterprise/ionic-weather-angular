# Ionic Weather - Angular

The primary purpose of this application is to be a test consumer of the [Demo Weather Widgets](https://github.com/ionic-enterprise/cs-demo-weather-widgets) component library.

## Obtaining a Key

This application requires that you have an [Open Weather Map](https://home.openweathermap.org/) API key. They offer a free tier with generous enough access for the requirements of this application. Once you have the key, you need to create a `src/environments/keys.json` with the key specified as such:

```json
{
  "openWeatherMap": "YOUR-KEY-HERE"
}
```

**Note:** this is _not_ a highly secure way to keep an API key safe. This keeps the key out of the GitHub repo, but that is it. If you need a secure mechanism to store sensitive information, you should be using a tool such as Ionic's [Identity Vault](https://ionic.io/docs/identity-vault).

## Building

Once you have a key, follow the usual build steps:

1. Clone the repo and `cd` into the project.
1. Create the `src/environments/keys.json` file as noted above.
1. `npm i`
1. `npm run build`

To run on a device or emulator:

- `ionic cap run ios`
- `ionic cap run android`

**Note:** to run on an iOS device, you need to open the project in Xcode at least once so you can select your team to specify your cert, etc.

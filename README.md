# Logpanel

![Code CI](https://github.com/DiamondLightSource/logpanel/actions/workflows/build.yml/badge.svg)
![License](https://img.shields.io/github/license/DiamondLightSource/logpanel)

| Source Code | https://github.com/DiamondLightSource/logpanel |
| ----------- | ---------------------------------------------- |

Frontend Logpanel, similar to the GDA Logpanel, that aggregates logs in the from the Graylog Server

## Development

Further Developing the Code requires both npm and yarn to be installed:

    yarn install

    yarn build

To test code and host server on localhost:

    yarn dev

## Deployment at DLS

To deploy, [make a release](https://github.com/DiamondLightSource/logpanel/releases/new), create a tag using [semantic versioning](https://semver.org/). After the release is complete, make a PR updating the `appVersion` in the [Helm Chart](https://github.com/DiamondLightSource/logpanel/blob/main/helm/logpanel/Chart.yaml) to your new version. Once that PR is merged the new deployment will be automatically synced and available at https://logpanel.diamond.ac.uk.

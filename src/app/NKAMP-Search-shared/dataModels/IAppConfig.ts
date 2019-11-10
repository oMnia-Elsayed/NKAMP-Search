import { NavigationMode, PlatformMode } from './enums';

export interface IAppConfig {
  apiUrl: string;
  dataSourceController: string;
  platform: PlatformMode;
  customSettings: string;
  componentSettings: any;
  navigationMode: NavigationMode;
}

// export interface IAppConfig {
//   Common: {
//     apiurl: string,
//     platform: PlatformMode,
//     navigationmode: NavigationMode,
//     customsettings: string
//   };
// }

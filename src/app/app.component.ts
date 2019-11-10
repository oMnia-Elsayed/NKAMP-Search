import { Component, ElementRef } from '@angular/core';
import { NavigationMode } from './NKAMP-Search-shared/dataModels/enums';
import { AppConfigService } from './NKAMP-Search-shared/services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentRate = 8;
  headerTitle = 'NKAMP Header';
  footerTitle = 'NKAMP Footer';
  NavMode = NavigationMode;
  languages = [{ code: 'en', label: 'English' }, { code: 'ar', label: 'عربي' }];

  async ngOnInit(): Promise<void> {
    await this.appConfig.load();
  }

  constructor(
    private appConfig: AppConfigService,
    private elementRef: ElementRef
  ) {
    // this.appConfig.componentName = this.elementRef.nativeElement.getAttribute(
    //   "ComponentName"
    // );
    this.appConfig.language = this.elementRef.nativeElement.getAttribute(
      'Lang'
    );
    this.appConfig.deployUrl = this.elementRef.nativeElement.getAttribute(
      'DeployUrl'
    );
  }

}

import { HttpErrorResponse } from "@angular/common/http";
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ComponentFactory, ComponentFactoryResolver, ComponentRef, Directive, DoCheck, Injector, OnChanges, OnDestroy, OnInit, QueryList, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, Observable, Subject, Subscription, throwError } from "rxjs";

import { debounceTime, distinctUntilChanged, skip, switchMap, takeUntil } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Directive()
export abstract class AppPage implements OnInit, OnDestroy, OnChanges, DoCheck, AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit {
  page: number = 1;
  totalItems: number = 0;
  numberToShow: number[] = [15, 30, 50, 100];
  pageSize: number = this.numberToShow[0];
  maxSize: number = 5;

  ranges: any = {
    "Today": [new Date(), new Date()],
    "Yesterday": [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1))],
    "Last 7 Days": [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],
    "Last 30 Days": [new Date(new Date().setDate(new Date().getDate() - 29)), new Date()],
    // "This Month": [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
    "This Month": [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
    "Last Month": [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().getFullYear(), new Date().getMonth(), 0)],
    "Next Month": [new Date(), new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())]
  };

  ngUnsubscribe: Subject<any> = new Subject();
  keyword: string = '';
  digitDecimal: number = 5;
  dataReport: any = null;


  isLoading: boolean | any = false;
  isCheckAll: boolean = false;
  isLocked: boolean | any = false;
  isShowUpdate: boolean = false;
  isReadonly: boolean | any = false;
  isCollapsed: boolean = false;
  isLinkReplicate: boolean = false;

  isProduction: boolean = environment.production;

  _isShowAutoComplete = new BehaviorSubject<boolean>(false);
  $isShowAutoComplete: Observable<boolean> = this._isShowAutoComplete.asObservable();



  optionEditor = {
    htmlExecuteScripts: false,
    heightMin: 150,
    charCounterCount: false,
    theme: 'royal',
    fontFamily: {
      "Roboto,sans-serif": 'Roboto',
      "Oswald,sans-serif": 'Oswald',
      "Montserrat,sans-serif": 'Montserrat',
      "'Open Sans Condensed',sans-serif": 'Open Sans Condensed',
      "'Arial',sans-serif,": 'Arial',
      "Time new Roman": 'Time new Roman',
      "Tahoma": 'Tahoma'
    },
    toolbarButtons: ['print', 'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', ' | ', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', ' | ', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', ' - ', 'insertLink', 'insertTable', ' | ', 'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', ' | ', 'spellChecker', 'help', 'html', ' | ', 'undo', 'redo'],
    quickInsertButtons: ['table', 'ul', 'ol', 'hr'],
    fontFamilySelection: true,
    language: 'vi',
  };

  currentUser: any;

  accepctFilesUpload = 'image/*,.txt,.pdf,.doc,.xlsx,.xls,.docx,.msg,.html,.zip';
  subscription: any;

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    //this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngDoCheck(): void { }

  ngOnChanges(changes: any): void { }

  ngAfterContentInit(): void { }

  ngAfterContentChecked(): void { }

  ngAfterViewInit(): void { }

  ngAfterViewChecked(): void { }

  trackByFn(index: number, item: any) {
    return !!item.id ? item.id : !!item.code ? item.code : index;
  }

  back() {
    window.history.back();
  }

  catchError(error: HttpErrorResponse): Observable<any> {
    return throwError(error || 'Có lỗi xảy, Vui lòng kiểm tra lại !');
  }

  autocomplete = (time: number, callBack: Function) => (source$: Observable<any>) =>
    source$.pipe(
      debounceTime(time),
      distinctUntilChanged(),
      switchMap((...args: any[]) =>
        callBack(...args).pipe(takeUntil(source$.pipe(skip(1))))
      )
    )
}

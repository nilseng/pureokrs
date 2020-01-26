import { TestBed, ComponentFixture, async } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import {RouterTestingModule} from '@angular/router/testing'

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>,
    appComponent: AppComponent

  beforeEach(async ()=>{
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    appComponent = fixture.componentInstance
  })

  it('should create the app', () => {
    expect(appComponent).toBeTruthy()
  })
})

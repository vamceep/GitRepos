import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MasterComponent } from './master/master.component';

import { HttpClientModule } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const token = 'Your github personal access token here';

@NgModule({
  declarations: [AppComponent, MasterComponent],
  imports: [BrowserModule, HttpClientModule, ApolloModule, HttpLinkModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({ uri: 'https://api.github.com/graphql' });
    const cache = new InMemoryCache();

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}` || null
        ),
      });

      return forward(operation);
    });

    apollo.create({
      link: concat(authMiddleware, http),
      cache,
    });
  }
}

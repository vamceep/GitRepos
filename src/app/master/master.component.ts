import { Component, OnInit, HostListener } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_PUBLIC_REPOS = gql`
  query {
    search(query: "is:public", type: REPOSITORY, first: 2) {
      pageInfo {
        endCursor
        startCursor
      }
      edges {
        node {
          ... on Repository {
            name
            description
            url
            owner {
              login
            }
          }
        }
      }
    }
  }
`;

const GET_MENTIONABLES = gql`
  query mentionables(
    $reponame: String = "bootstrap"
    $uname: String = "angular-ui"
  ) {
    repository(name: $reponame, owner: $uname) {
      mentionableUsers(first: 10) {
        nodes {
          name
          login
        }
      }
    }
  }
`;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
})
export class MasterComponent implements OnInit {
  searchresults: any[];
  loading = true;
  mentionableresults: any[];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: GET_PUBLIC_REPOS,
      })
      .valueChanges.subscribe((result) => {
        console.log(result.data['search']['edges']);
        this.searchresults = result.data && result.data['search']['edges'];
        console.log(this.searchresults);
      });

    this.searchresults = [
      {
        node: {
          name: 'murder',
          description:
            'Large scale server deploys using BitTorrent and the BitTornado library (NOTE: project no longer maintained)',
          url: 'https://github.com/lg/murder',
          owner: {
            login: 'lg',
            __typename: 'User',
          },
          __typename: 'Repository',
        },
        __typename: 'SearchResultItemEdge',
      },
      {
        node: {
          name: 'Iconic',
          description:
            'A minimal set of icons in raster, vector and font formats — free for public use.',
          url: 'https://github.com/somerandomdude/Iconic',
          owner: {
            login: 'somerandomdude',
            __typename: 'User',
          },
          __typename: 'Repository',
        },
        __typename: 'SearchResultItemEdge',
      },
    ];
  }

  @HostListener('document: click', ['$event'])
  clickout(event) {
    // var data = ['bootstrap', 'angular-ui'];
    // this.apollo
    //   .watchQuery({
    //     query: GET_MENTIONABLES,
    //     variables: {
    //       reponame: data[0],
    //       uname: data[1],
    //     },
    //   })
    //   .valueChanges.subscribe((result) => {
    //     this.mentionableresults = result.data && result.data['search']['edges'];
    //     console.log(this.mentionableresults);
    //   });

    console.log(event);
  }
}

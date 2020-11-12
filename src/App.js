// @flow

import React, { Component } from "react";
import GraphiQL from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import { buildClientSchema, getIntrospectionQuery, parse } from "graphql";

import { makeDefaultArg, getDefaultScalarArgValue } from "./CustomArgs";

import "graphiql/graphiql.css";
import "./App.css";
import type { GraphQLSchema } from "graphql";

function fetcher(params: Object): Object {
  return fetch(
    "http://localhost:5000/graphql",
    //   "https://engine.shikho.net/graphql",
    //   "https://api.shikho.net/graphql",

      {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIyODg1ODAiLCJlbWFpbCI6ImFkbWluQHNoaWtoby50ZWNoIiwiZXhwIjoxNjA2NTU0MDA0LCJpYXQiOjE2MDM5NjIwMDQsImp0aSI6IlpNcWw2RVBsTjh3MU1QTFpPWE9CUU5zR0FHaXJHTFRXIiwicm9sZSI6ImFkbWluIiwic3ViIjoiMjg4NTgwIiwidXNlcl9pZCI6IjI4ODU4MCIsInVzZXJfcGhvbmUiOiIwMTc2MDAwMDAwMCJ9.g46hYiMLoJ0AvrBuR5H9HWTJm_jUVRSFdF0RYZwGbDAzqY5oeDJ0Y-pJePeXW_kotTbdbUz9XFt6Lf-UTPFpyJmqQOtamgoNvX_zYbla-j-m_5MhrbvgSxBOHPkxDgXoJ8bdT9nymTt0mBu-c1WZJVQZE1OkXLy6foUOnkBNkgrnDf8Hxtbu4GKVApqzAeV9wAdoXTt4aCe_ksTGBLJLOPHUbvNG5fvpgKnZOhqG250wgI2-m6Zn7gDaOYxOEiu8UElB1kcqwgr8jhLO-Xu-lW15fSwK9IE9DDkw36h2_doP5j0yCBS1FTNGXY0xfYfC6JzkZ5rKMeX24UIgOYSWxg'

        // 'Authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxOE1KR0FRWDJVIiwiZW1haWwiOiJuYXNydWxsYWh0YXJpcXVlQGdtYWlsLmNvbSIsImV4cCI6MTYwNTAzNDAyMCwiaWF0IjoxNjA0OTkwODIwLCJqdGkiOiJpQU5FMkJDbzZ6Q3VYakhYQURPdGJlNjRUUXZSZ2g1VSIsInJvbGUiOiJzdHVkZW50Iiwic3ViIjoiMThNSkdBUVgyVSIsInVzZXJfaWQiOiIxOE1KR0FRWDJVIiwidXNlcl9waG9uZSI6IjAxNTM3MTYxMzQzIn0.oe9EEPFm1BIrK30FBkXFCorsBCoj1tP0i90LV16eXZx96lutWYfGZdRFlcIPK1kSfd1dN2spENpHYUkn_8CEV8u-m6kZ_Z9U6fosERsBQD0keoxfAY8OKsQlAPBEAU0hQT-rqyV8jXsl_BC3iEKQOCX4ai16Uo_tR6bziyancs6anlcTRfFUSk6R7R_HhbrMJwGUmQC-BPZRbSWMe4eDBhlZNErTFbTEWBWhbgPyFaES98RTrXf3CjqfzvQqK8j_YNCZg1vY1M3W8esP0AJK3Hho0ZbU4ZmBb7t2v2Iw0-MiPmWaJZ8SJJ-ZyEuMm9xJ4Fwt42Gd_zcrlQk8cZhexw'
        // Production Api student
        // Has subscription
        // 'Authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwNkczMFNGOFVTIiwiZW1haWwiOiJuYXNydWxsYWh0YXJpcXVlQGdtYWlsLmNvbSIsImV4cCI6MTYwNTUwOTUzMCwiaWF0IjoxNjAyOTE3NTMwLCJqdGkiOiJjeWJ6Tzc1ZVdRT1c1RXNvMWFXbWRBMnk1YkV4eEY2NCIsInJvbGUiOiJzdHVkZW50Iiwic3ViIjoiMDZHMzBTRjhVUyIsInVzZXJfaWQiOiIwNkczMFNGOFVTIiwidXNlcl9waG9uZSI6IjAxNTM3MTYxMzQzIn0.Xf5yPOGI_smdZxpxp2JOlp4lwDOnV-xGtv6ldF_SV7vkoc0Vljs1ofl_1ED2H9j1I9j-nIxKRuowGzO9B17mqr4RWpEsfeqtlCzXZMKdeM9-2jrx1thTulBfRjd4DeNwht2dxTLkzPOiF1Gc2c3JZWWJZDbYwEaguP6a68FyNxnpZW4mfNHceNLlWSxGlZo9NZAvG7duIgCEipzLn3PNUABJC0ga2l-l0bAdqY5EUgNCASFmobNaSKflOzjqWU_Aq70O_THg4cM608qec5oVkHI-8cJFUQZrP5sa_WHe9T4-K8t27gpV_TfhJepnGPZvZTfp8m8pM1NPM1qCAz35zA'
        // Dont have subscription
        // 'Authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJXSVo2OFpVRDZNIiwiZW1haWwiOiJuYXNydWxsYWh0YXJpcXVlLnNlY3JlZXRAZ21haWwuY29tIiwiZXhwIjoxNjA1NTA5MzA5LCJpYXQiOjE2MDI5MTczMDksImp0aSI6ImFpQ01kSG9EV1N6cDV6SEI2SXhrY2tIcTN6YlluMmt4Iiwicm9sZSI6InN0dWRlbnQiLCJzdWIiOiJXSVo2OFpVRDZNIiwidXNlcl9pZCI6IldJWjY4WlVENk0iLCJ1c2VyX3Bob25lIjoiMDE5OTE4MTMyMjUifQ.F2HbLcBYZ8YAtoMCaZwIoBZ4FpcwB0WnRNfecDvjct15gjT11p8Yr_VonUfjSkdr0z7g33pD7NcAOPHzgCRYzWwprHaUEGTiUpdAhGSKNuWeHQuijelPr4T5A-QzXoLwuBp-Ag_-4U1f-F1YXaZuwwBSqJQJiKq1cPxgUQa0UIlXUXrxflNf1OREMikfyykjAReiI-12j2kUziJ-diWMOdzeOz1Xf3c24DtMu7Vw447MVsDv9KX-4szCUNrC6CpQe32Cc8BtcLLU5BykTSj5cG1346pw0L8zW_ujCEgreoDeILfh_O2g0p_zdbgcu6RlRQi54bjmseyo2P3MXbIY2w'

      },
      body: JSON.stringify(params)
    }
  )
    .then(function(response) {
      return response.text();
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody);
      } catch (e) {
        return responseBody;
      }
    });
}

const DEFAULT_QUERY = `

mutation UpdateTopic {
  upsertTopic(chapter_id: "729af365-e0b5-499d-ba39-319482c1a152", no: "1.1") {
    id
    video {
      data {
        file_name
        id
        playback_url
        src_video_url
        subscription_type
        video_thumbnail_url
      }
    }
    no
    name
    description
  }
}

query ChaptersTopicVideosNoData {
  chapters(subject_code: "666266171") {
    data {
      topics {
        data {
          video {
            data {
              file_name
              id
              playback_url
              src_video_url
              subscription_type
              video_thumbnail_url
            }
          }
          description
          id
        }
      }
      id
      name
      no
    }
  }
}

query ChapterTopicVideos {
  chapters(subject_code: "706633169") {
    data {
      topics {
        data {
          video {
            data {
              file_name
              id
              playback_url
              src_video_url
              subscription_type
              video_thumbnail_url
            }
          }
          description
          id
        }
      }
      id
      name
      no
    }
  }
}

query GetTopics {
  topics(chapter_id: "c77ef877-035a-4618-bace-20a53b5a02f5") {
    data {
      description
      id
      name
      no
      meta {
        last_modified_by {
          name
        }
      }
    }
  }
}
`;

type State = {
  schema: ?GraphQLSchema,
  query: string,
  explorerIsOpen: boolean
};

class App extends Component<{}, State> {
  _graphiql: GraphiQL;
  state = { schema: null, query: DEFAULT_QUERY, explorerIsOpen: true };

  componentDidMount() {
    fetcher({
      query: getIntrospectionQuery()
    }).then(result => {
      const editor = this._graphiql.getQueryEditor();
      editor.setOption("extraKeys", {
        ...(editor.options.extraKeys || {}),
        "Shift-Alt-LeftClick": this._handleInspectOperation
      });

      this.setState({ schema: buildClientSchema(result.data) });
    });
  }

  _handleInspectOperation = (
    cm: any,
    mousePos: { line: Number, ch: Number }
  ) => {
    const parsedQuery = parse(this.state.query || "");

    if (!parsedQuery) {
      console.error("Couldn't parse query document");
      return null;
    }

    var token = cm.getTokenAt(mousePos);
    var start = { line: mousePos.line, ch: token.start };
    var end = { line: mousePos.line, ch: token.end };
    var relevantMousePos = {
      start: cm.indexFromPos(start),
      end: cm.indexFromPos(end)
    };

    var position = relevantMousePos;

    var def = parsedQuery.definitions.find(definition => {
      if (!definition.loc) {
        console.log("Missing location information for definition");
        return false;
      }

      const { start, end } = definition.loc;
      return start <= position.start && end >= position.end;
    });

    if (!def) {
      console.error(
        "Unable to find definition corresponding to mouse position"
      );
      return null;
    }

    var operationKind =
      def.kind === "OperationDefinition"
        ? def.operation
        : def.kind === "FragmentDefinition"
        ? "fragment"
        : "unknown";

    var operationName =
      def.kind === "OperationDefinition" && !!def.name
        ? def.name.value
        : def.kind === "FragmentDefinition" && !!def.name
        ? def.name.value
        : "unknown";

    var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

    var el = document.querySelector(selector);
    el && el.scrollIntoView();
  };

  _handleEditQuery = (query: string): void => this.setState({ query });

  _handleToggleExplorer = () => {
    this.setState({ explorerIsOpen: !this.state.explorerIsOpen });
  };

  render() {
    const { query, schema } = this.state;
    return (
      <div className="graphiql-container">
        <GraphiQLExplorer
          schema={schema}
          query={query}
          onEdit={this._handleEditQuery}
          onRunOperation={operationName =>
            this._graphiql.handleRunQuery(operationName)
          }
          explorerIsOpen={this.state.explorerIsOpen}
          onToggleExplorer={this._handleToggleExplorer}
          getDefaultScalarArgValue={getDefaultScalarArgValue}
          makeDefaultArg={makeDefaultArg}
        />
        <GraphiQL
          ref={ref => (this._graphiql = ref)}
          fetcher={fetcher}
          schema={schema}
          query={query}
          onEditQuery={this._handleEditQuery}
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              onClick={() => this._graphiql.handlePrettifyQuery()}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={() => this._graphiql.handleToggleHistory()}
              label="History"
              title="Show History"
            />
            <GraphiQL.Button
              onClick={this._handleToggleExplorer}
              label="Explorer"
              title="Toggle Explorer"
            />
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    );
  }
}

export default App;

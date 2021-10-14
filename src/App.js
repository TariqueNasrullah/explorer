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
    // "http://localhost:5000/graphql",
    //   "https://engine.shikho.net/graphql",
      "https://api.shikho.net/graphql",

      {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // dev student
        'Authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJWNDI1VUdTMDlKIiwiZW1haWwiOiJuYXNydWxsYWh0YXJpcXVlQGdtYWlsLmNvbSIsImV4cCI6MTYzNjY5MzUyOSwiaWF0IjoxNjM0MTAxNTI5LCJqdGkiOiJwNjBRZWw4RUJJejlKUzZjS0U2M1liakc3dGNaYjJ3ZSIsInJhdCI6IjEiLCJyb2xlIjoic3R1ZGVudCIsInN1YiI6IlY0MjVVR1MwOUoiLCJ1c2VyX2lkIjoiVjQyNVVHUzA5SiIsInVzZXJfcGhvbmUiOiIwMTUzNzE2MTM0MyJ9.BjbZj66Pz0r0yGySQWq8Q__Za4p_cODQk48Pn_yxTFpW_cA14Z4m_9fcWxQl5nKmkG25LdrGRwW5MhhQN7jlhYuQAx9qPshTIzyB9Jl5D_Qy0BM__b-juZbKnL0R3rOJDTw1l6qaJUz5EoZGaH9_5rzb4mXlm7-cbCd3K9jG9NWD10UMGc7kT989gnmvNQxj6CnIIV3q3ux4s2IsffbgkiIqojl66OflHZdOvrBtczkODRdilJp5sKjsmOIHkkAjqN5dAqUsMr2_NZfL3eB_XE1QSw50vhlXoVyK6jBIc7ZqpQIALtCN1C9_Kah_DeKzEd9ElLwLWx9cT7ESWQLlMg'

        // admin
        // 'Authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIyODg1ODAiLCJlbWFpbCI6ImFkbWluQHNoaWtoby50ZWNoIiwiZXhwIjoxNjM2NzAxNzIzLCJpYXQiOjE2MzQxMDk3MjMsImp0aSI6IlFTSXVIRUJOeVoyaWZlVzVlTXZmQzFWQ2Rpa2hRZXZtIiwicm9sZSI6ImFkbWluIiwic3ViIjoiMjg4NTgwIiwidXNlcl9pZCI6IjI4ODU4MCIsInVzZXJfcGhvbmUiOiIwMTc2MDAwMDAwMCJ9.Lc7-OJYB4cSHogAGuXPNzqMbd87oV6mOCZbUUevyIN88eFGj0aSzsQkCOoeTdcQNeO97pMd6EbaZWu2NHvUufy9zkTfQUL2EHrDNbqFDiEJCXf-GTrMZligiw5St1HtVa8HUZIfYPpBlc14syziI6JRolDP74_mTj9Qtrw7ahF0cbHmETBOXrYjsDW17yZtWnETptbY_oa24mEgiWyUSWtTUkeV1nbK9ZPqScAHPMRvdhkWF-VmK8ju7pHYSWub74A1tD8CtrlD9qrlN4YxeswIsgSTcow82PTFx7ET9H4LSXUBC5P0vuH1rF4L2DeidsTg45t18m4wW7xmWHpHtLw'
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

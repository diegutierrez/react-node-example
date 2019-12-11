import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import 'src/assets/stylesheets/base.scss';

function packageQuery(name, owner) {
	return gql`
    query {
      repository(name: "${name}", owner: "${owner}") {
        object(expression: "master:package.json") {
          ... on Blob {
            text
          }
        }
      }
    }
  `;
}

class App extends Component {
	state = {
		owner: 'sendgrid',
		repo: '',
		dependencies: {}
	};

	handleChange = (e) => {
		const { id, value } = e.target;
		return this.setState({ [id]: value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		const response = await this.props.client.query({
			query: packageQuery(this.state.repo, this.state.owner)
		});
		const { repository } = response.data;
		const parsed = JSON.parse(repository.object.text);
		return this.setState({ dependencies: parsed.dependencies });
	};

	render() {
		return (
			<div>
				<h1>{process.env.REACT_APP_URL} {process.env.NODE_ENV}</h1>
			</div>
		);
	}
}

export default withApollo(App);

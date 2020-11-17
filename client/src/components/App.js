import React from "react";
import { Layout } from "antd";
import Router from "./Router";

const { Header, Content } = Layout;

function App() {
	return (
		<Layout className="layout">
			<Header>
				<div className="logo" />
				<h1 style={{ color: "white" }}>Encrypted File Sharing</h1>
			</Header>

			<Content style={{ padding: "50px 50px" }}>
				<div className="site-layout-content">
					<Router />
				</div>
			</Content>
		</Layout>
	);
}

export default App;

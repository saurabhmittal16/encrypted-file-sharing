import React from "react";
import axios from "axios";
import { Result, Spin, Form, Input, Button, notification } from "antd";

const checkFile = async (path) => {
	try {
		const resp = await axios.get(
			`http://localhost:8080/api/check?file=${path}`
		);
		return resp.data.success;
	} catch (err) {
		console.log(err);
	}
};

const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 },
};

class File extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exists: null,
			password: null,
		};
		this.setPassword = this.setPassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const path = this.props.match.params.path;
		checkFile(path)
			.then((val) => this.setState({ exists: val }))
			.catch((err) => console.log(err));
	}

	setPassword(val) {
		this.setState({
			password: val,
		});
	}

	async handleSubmit() {
		const path = this.props.match.params.path;
		const password = this.state.password;
		try {
			const url = `http://localhost:8080/api/file?file=${path}&password=${password}`;
			await axios.get(url);

			notification.success({
				message: "Download image",
				description: (
					<a href={url} download="file" target="__blank">
						Link
					</a>
				),
			});

			this.setState({
				password: "",
			});
		} catch (err) {
			console.log(err);
			notification.error({
				message: "Wrong password",
			});
		}
	}

	render() {
		return (
			<div>
				{this.state.exists == null ? (
					<Spin
						size="large"
						style={{
							display: "block",
							margin: "auto",
						}}
					/>
				) : !this.state.exists ? (
					<Result
						status="404"
						title="404"
						subTitle="Sorry, the page you visited does not exist."
					/>
				) : (
					<div>
						<Form {...formItemLayout}>
							<Form.Item label="Password">
								<Input
									type="password"
									value={this.state.password}
									placeholder="Enter password to get file"
									onChange={(e) =>
										this.setPassword(e.target.value)
									}
								/>
							</Form.Item>

							<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
								<Button
									type="primary"
									htmlType="submit"
									onClick={this.handleSubmit}
								>
									Submit
								</Button>
							</Form.Item>
						</Form>
					</div>
				)}
			</div>
		);
	}
}

export default File;

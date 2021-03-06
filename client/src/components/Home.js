import React, { useState } from "react";
import axios from "axios";
import { Result, Input, Form, Button, notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
const FormItem = Form.Item;

const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 },
};

const Home = () => {
	const [password, setPassword] = useState("");
	const [files, setFile] = useState();

	const handleSubmit = async () => {
		const formData = new FormData();

		formData.append("password", password);
		formData.append("file", files[0]);

		try {
			const response = await axios.post(
				"http://localhost:8080/api/file",
				formData,
				{
					headers: {
						"content-type":
							"multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
					},
				}
			);

			notification.success({
				message: "Upload successful",
				description: (
					<span>
						The URL of uploaded file is{" "}
						{"http://localhost:3000/file/" + response.data.path}
						<button
							onClick={() => {
								navigator.clipboard.writeText(
									"http://localhost:3000/file/" +
										response.data.path
								);
							}}
						>
							Copy
						</button>
					</span>
				),
			});
		} catch (err) {
			notification.error({
				message: "Upload failed",
				description: <span>err.message</span>,
			});
		}
	};

	return (
		<div>
			<Result
				icon={<SmileOutlined />}
				title="Welcome to Encrypted File Sharing"
			/>

			<Form {...formItemLayout}>
				<FormItem label="Password to encrypt file">
					<Input
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormItem>

				<FormItem label="File to be uploaded">
					<input
						type="file"
						id="file"
						hidden
						onChange={(e) => setFile(e.target.files)}
					/>
					<label htmlFor="file" className="btn">
						Upload File
					</label>
				</FormItem>

				<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
					<Button
						type="primary"
						htmlType="submit"
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Home;

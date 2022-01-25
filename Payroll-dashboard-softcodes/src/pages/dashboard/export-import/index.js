/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import styled from 'styled-components';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';

import { DashboardSubWrapper } from 'pages/dashboard/company-structure';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Select from 'components/select';
import Input from 'components/input';
import { Button } from 'react-bootstrap';
import { exportFile, importFile } from 'redux/export-import/actions';
import { selectisLoading } from 'redux/export-import/selectors';

const ExportImport = ({ exportFile, importFile, isLoading }) => {
	const [module, setModule] = useState('');
	const [action, setAction] = useState('');

	const [employeeFile, setEmployeeFile] = useState();

	return (
		<>
			<NavLayout title="Export/Import" isBack />
			<DashboardSubWrapper className="wrapper-contain">
				<SectionHeadsnItems>
					<h4>Export or Import a specific module</h4>
					<div className="row">
						<div className="col-sm-12 offset-sm-2">
							<div className="row mt-5">
								<div className="col-sm-4">
									<Select
										hasStrip
										id="modules"
										name="modules"
										label="Modules"
										value={module}
										onChange={(e) => setModule(e.target.value)}
									>
										<option>--Select a module--</option>
										<option value="JOB_TITLE">Job Title</option>
										<option value="NATURE_OF_CONTRACT">
											Nature Of Contract
										</option>
										<option value="JOB_GRADES">Job Grades</option>
										<option value="BANKS">Banks</option>
										{/* <option value="LEAVE_CATEGORY">Leave Category</option>
										<option value="LEAVE_TYPES">Leave Types</option> */}
										<option value="HOLIDAY">Holiday</option>
										<option value="EMPLOYEE">Employees</option>
									</Select>
								</div>
								<div className="col-sm-4">
									<Select
										hasStrip
										id="action"
										name="action"
										label="Action"
										value={action}
										onChange={(e) => setAction(e.target.value)}
									>
										<option>--Select an action--</option>
										<option value="EXPORT">EXPORT</option>
										<option value="IMPORT">IMPORT</option>
									</Select>
								</div>
							</div>
							{action === 'EXPORT' && (
								<div className="col-sm-12 offset-sm-2 mt-4">
									{/* <Button
										variant="outline-primary mr-5"
										onClick={() => {
											exportFile({
												export_type: 'PDF',
												module,
											});
										}}
									>
										Export as PDF
									</Button> */}
									<Button
										variant="outline-primary"
										onClick={() => {
											exportFile({
												export_type: 'EXCEL',
												module,
											});
										}}
									>
										Export as EXCEL
									</Button>
								</div>
							)}
							{action === 'IMPORT' && module === 'EMPLOYEE' && (
								<div className="col-sm-4 offset-sm-2 mt-4">
									<Input
										type="file"
										name="employee"
										className="col-sm-3"
										label="Select file"
										onChange={(e) => {
											setEmployeeFile(e.target.files[0]);
										}}
									/>
									<Button
										variant="outline-primary"
										onClick={() => {
											const data = new FormData();
											data.append('employeeFile', employeeFile);
											importFile(data);
										}}
									>
										Import Excel
									</Button>
								</div>
							)}
						</div>
					</div>
				</SectionHeadsnItems>
			</DashboardSubWrapper>
		</>
	);
};

const SectionHeadsnItems = styled.div`
	margin-top: 2rem;
	background: #ffffff;
	justify-content: center;
	padding: 2rem;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});
export default connect(mapStateToProps, {
	exportFile,
	importFile,
})(ExportImport);

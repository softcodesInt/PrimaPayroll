/* -------------------------------------------------------------------------- */
/*                            External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { useState } from 'react';
import styled from 'styled-components';
/* -------------------------- Internal Dependencies ------------------------- */
import NavLayout from 'components/layout/dashboard-layout/navbar';
import Button from 'components/button';
import Input from 'components/input';

/* --------------------------- Image Dependencies --------------------------- */
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectisLoading } from 'redux/settings/selectors';
import { downloadBackup, restoreBackup } from 'redux/export-import/actions';
import { DashboardSubWrapper } from '../../company-structure';

const BackupRestore = ({ isLoading, downloadBackup, restoreBackup }) => {
	const [restoreFile, setRestoreFile] = useState();
	return (
		<>
			<NavLayout title="Backup/Restore" />
			<DashboardSubWrapper className="wrapper-contain">
				<h4 className="page-main-title">Backup/Restore</h4>
				<SectionHeadsnItems className="main-table-wrapper">
					<FormWrapper>
						<FormContent>
							<div className="row mr-10">
								<div className="col-md-6 col-sm-6">
									<h4>Backup</h4>
									<span>
										Download a backup copy of the database. Note that you may be
										logged out after the backup gets downloaded. Please keep the
										backup file and ensure not to alter it otherwise you won't
										be able to restore what you downloaded.
									</span>
									<Button
										className="btn-soft mr-auto mt-4"
										isLoading={isLoading}
										disabled={isLoading}
										onClick={() => downloadBackup()}
									>
										Download Backup
									</Button>
								</div>
								<div className="col-sm-6 col-md-6">
									<h4>Restore</h4>
									<span>
										Do you want to rollback to a particular state? Upload the
										backup file you have downloaded and you will have a rollback
										state. Note that every action you have carried out after you
										downloaded the backup file you want to restore will be
										deleted.
									</span>
									<Input
										type="file"
										name="employee"
										className="col-sm-3"
										label="Select file"
										onChange={(e) => {
											setRestoreFile(e.target.files[0]);
										}}
									/>
									<Button
										variant="info"
										className="btn btn-info"
										type="button"
										onClick={() => {
											const data = new FormData();
											data.append('restore_file', restoreFile);
											restoreBackup(data);
										}}
									>
										Restore Backup
									</Button>
								</div>
							</div>
						</FormContent>
					</FormWrapper>
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

const FormWrapper = styled.div`
	margin-top: 1rem;
`;

const FormContent = styled.div`
	width: 80%;
	margin: 0 auto;
`;

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
});
export default connect(mapStateToProps, { downloadBackup, restoreBackup })(
	BackupRestore
);

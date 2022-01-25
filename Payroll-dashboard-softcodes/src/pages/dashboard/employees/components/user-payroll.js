import React from 'react';
import { useMount } from 'broad-state';
import { Table } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';
import Button from 'components/button';
import { TableWrap } from 'components/layout/dashboard-layout';
import Loader from 'components/loader';
import Paginate from 'components/pagination';
import { isEmpty } from 'codewonders-helpers';
import { getEmployeePayslip, downloadPayslip } from 'redux/employee/actions';
import {
	selectisLoading,
	selectEmployeePayslip,
} from 'redux/employee/selectors';
import { formatAmount } from 'utils';

const UserPaySlip = ({
	getEmployeePayslip,
	isLoading,
	payslips,
	id,
	downloadPayslip,
}) => {
	useMount(() => {
		if (isEmpty(payslips)) {
			getEmployeePayslip(id);
		}
	});

	return (
		<TableWrap>
			<p>Payslip Histories</p>
			<Table responsive>
				<thead>
					<tr>
						<th>GROSS PAY</th>
						<th>NET PAY</th>
						<th>DATE PAID</th>
						<th>DOWNLOAD</th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<Loader loadingText="Fetching Company Policies" />
					) : (
						payslips?.results?.map((row, index) => (
							<tr key={index}>
								<td>{formatAmount(row.gross_pay)}</td>
								<td>{formatAmount(row.net_pay)}</td>
								<td className="w-32">
									{moment(row.date_created).format('YYYY-MM-DD')}
								</td>
								<td>
									<Button
										type="submit"
										className="btn-soft ml-auto btn-info"
										onClick={() => downloadPayslip(row.id)}
									>
										Download
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>
			<Paginate
				total={payslips?.total_pages}
				next={payslips?.next}
				currentPage={payslips?.current_page}
				previous={payslips?.previous}
				getData={getEmployeePayslip}
				getNext={() => getEmployeePayslip('', '', payslips?.next)}
				getPrevious={() => getEmployeePayslip('', '', payslips?.previous)}
			/>
		</TableWrap>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoading,
	payslips: selectEmployeePayslip,
});
export default connect(mapStateToProps, {
	getEmployeePayslip,
	downloadPayslip,
})(UserPaySlip);

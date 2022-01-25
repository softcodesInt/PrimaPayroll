import React from 'react';
import { useMount } from 'broad-state';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { isEmpty } from 'codewonders-helpers';

import Button from 'components/button';
import Select, { MultiSelect } from 'components/select';
import Loader from 'components/loader';
import {
	selectisLoadingCategory,
	selectAllCategories,
	selectCurrentLeave,
	selectisLoading,
} from 'redux/leave/selectors';
import { getAllLeaveCategory, getLeaveById } from 'redux/leave/actions';
import { ErrorText } from 'components/input';

const LeaveSetupForm = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	handleSubmit,
	setFieldValue,
	setFieldTouched,

	isEdit,
	employee,

	leaveCategories,
	isLoading,
	getAllLeaveCategory,
	getLeaveById,
	isLoadingLeave,
	leaves,
}) => {
	useMount(() => {
		if (isEmpty(leaveCategories)) {
			getAllLeaveCategory('', 1, 'sort_by=active');
		}
	});
	const getLeave = (id) => {
		if (id) getLeaveById(id, employee?.gender, 'sort_by=active');
	};

	const getMultiSelectOptions = (data) => {
		if (!isEmpty(data)) {
			return data?.map((value) => {
				return {
					value: value.id,
					label: value.name,
				};
			});
		}
		return [];
	};

	const getSelectDefault = (value, options) => {
		let d;
		let formattedData;
		if (!isEmpty(value)) {
			d = value?.filter((option) => {
				return getMultiSelectOptions(options)?.filter(
					(data) => data.id === option.value
				);
			});
		}
		if (d) {
			formattedData = d.map((data) => {
				return {
					label: data.name,
					value: data.id,
				};
			});
		}
		return formattedData;
	};
	return (
		<div className="row">
			<form onSubmit={handleSubmit}>
				{isLoading ? (
					<Loader loadingText="Fetching Company Policies" />
				) : (
					<>
						<div className="col-md-6 col-offset-md-2">
							<Select
								hasStrip
								id="leave_category"
								name="leave_category"
								label="Leave Category"
								value={values.leave_category}
								onChange={(e) => {
									setFieldTouched('leave_category', true);
									setFieldValue('leave_category', e.target.value);
									getLeave(e.target.value);
								}}
								onBlur={handleBlur}
								errorMessage={errors.leave_category}
								isInvalid={errors.leave_category && touched.leave_category}
							>
								<option>--Choose a leave category--</option>
								{leaveCategories?.results?.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</Select>

							{errors?.leave_category ? (
								<ErrorText>{errors?.leave_category}</ErrorText>
							) : (
								<></>
							)}
						</div>
						{isLoadingLeave && (
							<Loader loadingText="Getting selected category leave types" />
						)}
						{values.leave_category && !isLoadingLeave && (
							<>
								<MultiSelect
									label="Select Leaves*"
									placeholder="Select all the leaves this user belongs to"
									options={getMultiSelectOptions(leaves.leaves)}
									onChange={(value) => {
										setFieldValue('leaves', value);
										setFieldTouched('leaves', true);
									}}
									value={
										isEdit && !touched.leaves
											? getSelectDefault(values?.leaves, leaves)
											: values.leaves
									}
									name="leaves"
								/>
								<ErrorText>{errors?.leaves}</ErrorText>
							</>
						)}
						<Button
							type="submit"
							className="btn-soft mr-auto mt-4"
							isLoading={isLoading}
							disabled={isLoading}
						>
							{isEdit ? 'Save Changes' : 'Submit & Continue'}
						</Button>
					</>
				)}
			</form>
		</div>
	);
};

const mapStateToProps = createStructuredSelector({
	isLoading: selectisLoadingCategory,
	leaveCategories: selectAllCategories,
	isLoadingLeave: selectisLoading,
	leaves: selectCurrentLeave,
});
export default connect(mapStateToProps, { getAllLeaveCategory, getLeaveById })(
	LeaveSetupForm
);

import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button';
import Input from 'components/input';
import Select from 'components/select';

const propTypes = {
	values: PropTypes.shape,
	errors: PropTypes.shape,
	touched: PropTypes.shape,
	handleChange: PropTypes.func,
	handleBlur: PropTypes.func,
	handleSubmit: PropTypes.func,
	isLoading: PropTypes.bool,
	isEdit: PropTypes.bool,
};

const EmployeeInfoForm = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	handleSubmit,
	isLoading,
	isEdit,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<div className="row">
				<div className="col-md-2">
					<Select
						hasStrip
						id="title"
						name="title"
						label="Title"
						value={values.title}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.title}
						isInvalid={errors.title && touched.title}
					>
						<option>-Select-</option>
						<option value="MR">Mr</option>
						<option value="MRS">Mrs</option>
						<option value="Miss">Miss</option>
						<option value="Chief">Chief</option>
						<option value="Dr">Dr</option>
					</Select>
				</div>
				<div className="col-md-4">
					<Input
						hasStrip
						id="first_name"
						name="first_name"
						type="text"
						label="First Name*"
						placeholder="Enter first name"
						value={values.first_name}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.first_name}
						isInvalid={errors.first_name && touched.first_name}
					/>
				</div>
				<div className="col-md-3">
					<Input
						hasStrip
						id="last_name"
						name="last_name"
						type="text"
						label="Last Name*"
						placeholder="Enter last name"
						value={values.last_name}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.last_name}
						isInvalid={errors.last_name && touched.last_name}
					/>
				</div>
				<div className="col-md-3">
					<Input
						hasStrip
						id="other_name"
						name="other_name"
						type="text"
						label="Other Name"
						placeholder="Enter other name"
						value={values.other_name}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.other_name}
						isInvalid={errors.other_name && touched.other_name}
					/>
				</div>
			</div>
			<div className="row mb-3">
				<div className="col-md-4">
					<Input
						hasStrip
						id="personal_email"
						name="personal_email"
						type="email"
						label="Personal Email"
						placeholder="Enter personal name"
						value={values.personal_email}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.personal_email}
						isInvalid={errors.personal_email && touched.personal_email}
					/>
				</div>
				<div className="col-md-4">
					<Select
						hasStrip
						id="marital_status"
						name="marital_status"
						label="Marital Status*"
						value={values.marital_status}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.marital_status}
						isInvalid={errors.marital_status && touched.marital_status}
					>
						<option>--Choose a marital status--</option>
						<option value="MARRIED">Married</option>
						<option value="DIVORCED">Divorced</option>
						<option value="SINGLE">Single</option>
						<option value="WIDOWED">Widowed</option>
					</Select>
				</div>
				<div className="col-md-4">
					<Select
						hasStrip
						id="gender"
						name="gender"
						label="Gender*"
						value={values.gender}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.gender}
						isInvalid={errors.gender && touched.gender}
					>
						<option>--Choose a gender--</option>
						<option value="MALE">Male</option>
						<option value="FEMALE">Female</option>
					</Select>
				</div>
				<div className="col-md-4">
					<Input
						hasStrip
						id="date_of_birth"
						name="date_of_birth"
						type="date"
						format="yyyy-mm-dd"
						label="Date of birth*"
						placeholder="yyyy-mm-dd"
						value={values.date_of_birth}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.date_of_birth}
						isInvalid={errors.date_of_birth && touched.date_of_birth}
					/>
				</div>
				<div className="col-md-4">
					<Select
						hasStrip
						id="nationality"
						name="nationality"
						label="Nationality*"
						value={values.nationality}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.nationality}
						isInvalid={errors.nationality && touched.nationality}
					>
						<option>--Choose a nationality--</option>
						<option value="NIGERIA">Nigeria</option>
						<option value="NIGER">Niger</option>
					</Select>
				</div>
				<div className="col-md-4">
					<Input
						hasStrip
						id="phone_number"
						name="phone_number"
						type="text"
						label="Phone Number*"
						placeholder="+23480.."
						value={values.phone_number}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.phone_number}
						isInvalid={errors.phone_number && touched.phone_number}
					/>
				</div>
			</div>
			<h5> Next of Kin Information</h5>
			<div className="row mt-4">
				<div className="col-md-4">
					<Input
						hasStrip
						id="next_of_kin_name"
						name="next_of_kin_name"
						type="text"
						label="Next of Kin name"
						placeholder="Enter name of next of kin"
						value={values.next_of_kin_name}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.next_of_kin_name}
						isInvalid={errors.next_of_kin_name && touched.next_of_kin_name}
					/>
				</div>
				<div className="col-md-4">
					<Input
						hasStrip
						id="next_of_kin_email"
						name="next_of_kin_email"
						type="text"
						label="Next of Kin Email"
						placeholder="Enter next of kin email"
						value={values.next_of_kin_email}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.next_of_kin_email}
						isInvalid={errors.next_of_kin_email && touched.next_of_kin_email}
					/>
				</div>
				<div className="col-md-4">
					<Input
						hasStrip
						id="next_of_kin_phone_number"
						name="next_of_kin_phone_number"
						type="text"
						label="Next of Kin Phone Number"
						placeholder="Enter next of kin phone number"
						value={values.next_of_kin_phone_number}
						onChange={handleChange}
						onBlur={handleBlur}
						errorMessage={errors.next_of_kin_phone_number}
						isInvalid={
							errors.next_of_kin_phone_number &&
							touched.next_of_kin_phone_number
						}
					/>
				</div>
			</div>
			<Button
				type="submit"
				className="btn-soft mr-auto mt-4"
				isLoading={isLoading}
				disabled={isLoading}
			>
				{isEdit ? 'Save Changes' : 'Add Employee Info'}
			</Button>
		</form>
	);
};

EmployeeInfoForm.propTypes = propTypes;

export default EmployeeInfoForm;

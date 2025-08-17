import { useState } from "react";
import { TextInput, Select, Button, Stack, Group } from "@mantine/core";
import BankSelect from "../../../components/BankList";
type BankFormData = {
  name: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  phone: string;
  email: string;
  status: string;
};

type AddBankModalProps = {
  onClose: () => void;
  onSubmit: (data: BankFormData) => void;
};
const AddBankModal = ({ onClose, onSubmit }: AddBankModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    accountName: "",
    accountNumber: "",
    phone: "",
    email: "",
    status: "Hoạt động",
  });

  const handleChange = (field: keyof BankFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Stack gap="md">
      <BankSelect />
      <Select
        searchable
        clearable
        label="Chi nhánh"
        placeholder="Chi nhánh"
        data={[
          { value: "hanoi", label: "Chi nhánh Hà Nội" },
          { value: "saigon", label: "Chi nhánh Sài Gòn" },
          { value: "danang", label: "Chi nhánh Đà Nẵng" },
          { value: "cantho", label: "Chi nhánh Cần Thơ" },
        ]}
        value={formData.branch}
        onChange={(value) => handleChange("branch", value!)}
        radius={4}
        withAsterisk
      />
      <TextInput
        label="Tên chủ tài khoản"
        placeholder="Nhập tên chủ tài khoản"
        value={formData.accountName}
        onChange={(e) => handleChange("accountName", e.currentTarget.value)}
        radius={4}
        withAsterisk
      />
      <TextInput
        label="Số tài khoản"
        placeholder="Nhập số tài khoản"
        value={formData.accountNumber}
        onChange={(e) => handleChange("accountNumber", e.currentTarget.value)}
        radius={4}
        withAsterisk
      />
      <TextInput
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.currentTarget.value)}
        radius={4}
      />
      <TextInput
        label="Email"
        placeholder="Nhập email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.currentTarget.value)}
        radius={4}
      />
      <Select
        searchable
        clearable
        label="Trạng thái"
        placeholder="Trạng thái"
        data={[
          { value: "Hoạt động", label: "Hoạt động" },
          { value: "Không hoạt động", label: "Không hoạt động" },
        ]}
        value={formData.status}
        onChange={(value) => handleChange("status", value!)}
        radius={4}
      />
      <Group justify="flex-end">
        <Button variant="outline" radius={4} onClick={onClose}>
          Hủy
        </Button>
        <Button radius={4} onClick={handleSubmit}>
          Lưu
        </Button>
      </Group>
    </Stack>
  );
};

export default AddBankModal;

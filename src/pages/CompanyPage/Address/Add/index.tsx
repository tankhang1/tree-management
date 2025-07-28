import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Title,
  Card,
  Input,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconBuilding,
  IconHome,
  IconMap,
  IconSearch,
} from "@tabler/icons-react";
import { SelectableEnterpriseCards } from "../../../StockManagementPage/Delivery/Add/components/SelectableEnterpriseCards";

const CompanyAddressAddPage = () => {
  const [type, setType] = useState<"Doanh nghiệp" | "Nông hộ" | "Hợp tác xã">(
    "Doanh nghiệp"
  );
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    recipientName: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    note: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Địa chỉ mới:", formData);
  };

  return (
    <Card withBorder shadow="sm" p="lg" radius={4}>
      <Group mb={"xs"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới địa chỉ</Title>
      </Group>
      <Stack gap="xs">
        <Input.Wrapper label="Loại hình">
          <Group>
            <Button
              leftSection={<IconBuilding size={18} />}
              variant={type === "Doanh nghiệp" ? "filled" : "outline"}
              onClick={() => setType("Doanh nghiệp")}
              radius={4}
            >
              Doanh nghiệp
            </Button>
            <Button
              leftSection={<IconHome size={18} />}
              variant={type === "Nông hộ" ? "filled" : "outline"}
              radius={4}
              onClick={() => setType("Nông hộ")}
            >
              Nông hộ
            </Button>
            <Button
              leftSection={<IconMap size={18} />}
              variant={type === "Hợp tác xã" ? "filled" : "outline"}
              radius={4}
              onClick={() => setType("Hợp tác xã")}
            >
              Hợp tác xã
            </Button>
          </Group>
        </Input.Wrapper>
        <TextInput
          label={type}
          placeholder="Tìm kiếm doanh nghiệp"
          radius={4}
          leftSection={<IconSearch size={18} />}
        />
        <SelectableEnterpriseCards isCheckbox={false} isMulti={false} />
        <Group grow>
          <TextInput
            label="Người nhận"
            placeholder="Nhập tên người nhận"
            value={formData.recipientName}
            onChange={(e) =>
              handleChange("recipientName", e.currentTarget.value)
            }
            radius={4}
            withAsterisk
          />
          <TextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.currentTarget.value)}
            radius={4}
            withAsterisk
          />
        </Group>
        <Group grow>
          <TextInput
            label="Email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.currentTarget.value)}
            radius={4}
          />
          <TextInput
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={(e) => handleChange("address", e.currentTarget.value)}
            radius={4}
            withAsterisk
          />
        </Group>
        <TextInput
          label="Mã số thuế"
          placeholder="Nhập mã số thuế (nếu có)"
          value={formData.taxCode}
          onChange={(e) => handleChange("taxCode", e.currentTarget.value)}
          radius={4}
        />
        <Textarea
          label="Ghi chú"
          placeholder="Nhập ghi chú (nếu có)"
          value={formData.note}
          onChange={(e) => handleChange("note", e.currentTarget.value)}
          radius={4}
          minRows={3}
        />
        <Group justify="flex-end">
          <Button radius={4} onClick={handleSubmit}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default CompanyAddressAddPage;

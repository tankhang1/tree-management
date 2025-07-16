import {
  TextInput,
  Select,
  Button,
  Textarea,
  Group,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const CompanyForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      type: "hộ nông dân",
      ownerName: "",
      identityNumber: "",
      phone: "",
      email: "",
      address: "",
      location: { lat: 0, lng: 0 },
      taxCode: "",
      landCertificateNo: "",
      note: "",
    },

    validate: {
      name: (v) => (!v ? "Bắt buộc" : null),
      type: (v) => (!v ? "Bắt buộc" : null),
      ownerName: (v) => (!v ? "Bắt buộc" : null),
      identityNumber: (v) => (!v ? "Bắt buộc" : null),
      phone: (v) => (!v ? "Bắt buộc" : null),
      address: (v) => (!v ? "Bắt buộc" : null),
    },
  });

  return (
    <form>
      <Stack gap="xs">
        <TextInput
          radius={4}
          label="Tên đơn vị"
          {...form.getInputProps("name")}
          required
        />
        <Select
          radius={4}
          label="Loại hình"
          data={[
            { value: "hộ nông dân", label: "Hộ nông dân" },
            { value: "doanh nghiệp", label: "Doanh nghiệp" },
            { value: "hợp tác xã", label: "Hợp tác xã" },
          ]}
          {...form.getInputProps("type")}
          required
        />
        <TextInput
          radius={4}
          label="Chủ sở hữu"
          {...form.getInputProps("ownerName")}
          required
        />
        <TextInput
          radius={4}
          label="CCCD/CMND"
          {...form.getInputProps("identityNumber")}
          required
        />
        <TextInput
          radius={4}
          label="Số điện thoại"
          {...form.getInputProps("phone")}
          required
        />
        <TextInput radius={4} label="Email" {...form.getInputProps("email")} />
        <TextInput
          radius={4}
          label="Địa chỉ"
          {...form.getInputProps("address")}
          required
        />
        <Group grow>
          <TextInput
            radius={4}
            label="Latitude"
            type="number"
            {...form.getInputProps("location.lat")}
          />
          <TextInput
            radius={4}
            label="Longitude"
            type="number"
            {...form.getInputProps("location.lng")}
          />
        </Group>
        <TextInput
          radius={4}
          label="Mã số thuế"
          {...form.getInputProps("taxCode")}
        />
        <TextInput
          radius={4}
          label="Số sổ đỏ / Giấy CN QSDĐ"
          {...form.getInputProps("landCertificateNo")}
        />
        <Textarea
          radius={4}
          label="Ghi chú"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
        />
        <Group justify="right">
          <Button type="submit" radius={4}>
            Tạo mới
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CompanyForm;

import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Text,
  Modal,
  Radio,
  MultiSelect,
  Input,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconFilter,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone } from "@mantine/dropzone";

// Dữ liệu mẫu (có thể lấy từ API thực tế)
const pesticideOptions = [
  { value: "PST001", label: "Thuốc trừ sâu Regent" },
  { value: "PST002", label: "Thuốc trừ bệnh Anvil" },
  { value: "PST003", label: "Thuốc vi sinh Bio-B" },
];

const disposalReasons = [
  { value: "expired", label: "Hết hạn sử dụng" },
  { value: "damaged", label: "Hư hỏng, bao bì rách" },
  { value: "recalled", label: "Thu hồi theo lô sản xuất" },
  { value: "other", label: "Lý do khác" },
];

const AddDisposalForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);

  const [mode, setMode] = useState<"group" | "dept">("group");

  const form = useForm({
    initialValues: {
      id: "",
      pesticideId: "",
      disposalDate: new Date(),
      staffId: "",
      reason: "",
      quantity: 0,
      notes: "",
    },
    validate: {
      id: (v) => (!v ? "Mã phiếu không được để trống" : null),
      pesticideId: (v) => (!v ? "Chọn thuốc cần huỷ" : null),
      staffId: (v) => (!v ? "Chọn người thực hiện" : null),
      reason: (v) => (!v ? "Vui lòng chọn lý do" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải lớn hơn 0" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Phiếu huỷ thuốc:", values);
    // TODO: Gửi đến backend hoặc cập nhật store
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu"
          placeholder="VD: PD004"
          withAsterisk
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          label="Thuốc cần huỷ"
          placeholder="Chọn thuốc"
          data={pesticideOptions}
          withAsterisk
          radius={4}
          {...form.getInputProps("pesticideId")}
        />

        <DateTimePicker
          label="Ngày huỷ"
          radius={4}
          withAsterisk
          {...form.getInputProps("disposalDate")}
        />

        <Group>
          <Text fw={500} fz={14}>
            Nhân sự thực hiện
          </Text>
          <Button
            variant="light"
            radius={4}
            leftSection={<IconFilter size={18} />}
            onClick={openFilterEmployee}
          >
            Lọc nhân sự
          </Button>
        </Group>
        <Group grow>
          <NumberInput
            label="Số lượng"
            radius={4}
            placeholder="Nhập số lượng"
            min={1}
            {...form.getInputProps("amount")}
          />

          {/* <Select label="Đơn vị" radius={4} placeholder="Đơn vị" /> */}
          <MultiSelect
            label="Quy cách"
            radius={4}
            placeholder="Quy cách"
            data={[
              {
                value: "PKG001",
                label: "Hộp giấy nhỏ (50 cái)",
              },
              {
                value: "PKG002",
                label: "Túi nilon lớn (100 cái)",
              },
              {
                value: "PKG003",
                label: "Bao tải 25kg (25 cái)",
              },
              {
                value: "PKG004",
                label: "Bịch nhựa 1kg (10 cái)",
              },
              {
                value: "PKG005",
                label: "Thùng carton lớn (20 cái)",
              },
              {
                value: "PKG006",
                label: "Hộp nhựa 500ml (30 cái)",
              },
            ]}
          />
        </Group>
        <Select
          label="Lý do huỷ thuốc"
          placeholder="VD: Thuốc hết hạn, bao bì rách..."
          data={disposalReasons}
          withAsterisk
          radius={4}
          {...form.getInputProps("reason")}
        />

        <Textarea
          label="Mô tả chi tiết"
          placeholder="Mô tả chi tiết"
          radius={4}
          autosize
          minRows={2}
          {...form.getInputProps("notes")}
        />
        <Input.Wrapper label="Chứng từ liên quan">
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={["application/pdf"]}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  size={52}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={52}
                  color="var(--mantine-color-red-6)"
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  size={52}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Bỏ và thả file tại đây
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Đính kèm file (tối đa 5MB)
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Input.Wrapper>
        <Group justify="flex-end" mt="md">
          <Button type="submit" radius={4}>
            Lưu phiếu
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={700}>Lọc nhân sự</Text>}
      >
        <Stack gap="xs">
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Đội nhóm"
              radius={4}
              data={["Nhóm canh tác", "Nhóm vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Vai trò"
                radius={4}
                data={["Tổ trưởng", "Trưởng phòng", "Giám sát"]}
              />
            </>
          )}

          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
    </form>
  );
};

export default AddDisposalForm;

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

// Dữ liệu mẫu (tuỳ chỉnh hoặc fetch từ API)
const machineOptions = [
  { value: "MC001", label: "Máy cày Kubota MC001" },
  { value: "MC002", label: "Máy gieo hạt MC002" },
  { value: "MC003", label: "Máy phun thuốc MC003" },
];

const disposalReasons = [
  { value: "broken", label: "Hỏng hoàn toàn, không thể sửa" },
  { value: "upgrade", label: "Thanh lý để thay máy mới" },
  { value: "expired", label: "Hết thời gian sử dụng" },
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
      machineId: "",
      disposalDate: new Date(),
      staffId: "",
      reason: "",
      valueRecovered: 0,
      notes: "",
    },
    validate: {
      id: (v) => (!v ? "Mã phiếu không được để trống" : null),
      machineId: (v) => (!v ? "Chọn máy cần thanh lý" : null),
      staffId: (v) => (!v ? "Chọn người thực hiện" : null),
      reason: (v) => (!v ? "Vui lòng chọn lý do" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Dữ liệu phiếu thanh lý:", values);
    // TODO: Gửi dữ liệu đến backend hoặc cập nhật local state
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu"
          placeholder="VD: DIS004"
          withAsterisk
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          label="Máy cần thanh lý"
          placeholder="Chọn mã máy"
          data={machineOptions}
          radius={4}
          withAsterisk
          {...form.getInputProps("machineId")}
        />

        <DateTimePicker
          label="Ngày thanh lý"
          radius={4}
          withAsterisk
          {...form.getInputProps("disposalDate")}
        />

        <Group>
          <Text fw={"500"} fz={14}>
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

        <Select
          label="Lý do thanh lý"
          placeholder="VD: Máy hỏng, nâng cấp thiết bị"
          data={disposalReasons}
          radius={4}
          withAsterisk
          {...form.getInputProps("reason")}
        />
        <Group grow>
          <NumberInput
            label="Số lượng"
            radius={4}
            placeholder="Nhập số lượng"
            min={1}
            {...form.getInputProps("amount")}
          />

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
        <NumberInput
          radius={4}
          label="Giá trị thu hồi (nếu có)"
          placeholder="Nhập giá trị (VND)"
          min={0}
          {...form.getInputProps("valueRecovered")}
        />

        <Textarea
          label="Ghi chú"
          placeholder="Ghi chú thêm nếu có"
          minRows={2}
          radius={4}
          autosize
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
          <Button radius={4}>Lưu phiếu</Button>
        </Group>
      </Stack>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        size={"lg"}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Đội nhóm" />
            <Radio value="dept" label="Phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList isMultiple />
        </Stack>

        <Group mt="md" justify="flex-end">
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

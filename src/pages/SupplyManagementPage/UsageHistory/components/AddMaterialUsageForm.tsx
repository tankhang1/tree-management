import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  Modal,
  Text,
  Radio,
  MultiSelect,
  Input,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconFilter,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { Dropzone } from "@mantine/dropzone";

// Dữ liệu mẫu (có thể thay bằng API hoặc Context)
const materialOptions = [
  { value: "MAT001", label: "Phân bón lá" },
  { value: "MAT002", label: "Phân NPK" },
  { value: "MAT003", label: "Thuốc bảo vệ thực vật" },
];

type FormValues = {
  id: string;
  materialId: string;
  startTime: Date;
  endTime: Date;
  usedBy: string;
  purpose: string;
  location: string;
};

const AddMaterialUsageForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      materialId: "",
      startTime: new Date(),
      endTime: new Date(),
      usedBy: "",
      purpose: "",
      location: "",
    },
    validate: {
      id: (v) => (!v ? "Mã phiếu không được để trống" : null),
      materialId: (v) => (!v ? "Vui lòng chọn vật tư" : null),
      usedBy: (v) => (!v ? "Chọn người sử dụng" : null),
      purpose: (v) => (!v ? "Nhập mục đích sử dụng" : null),
      location: (v) => (!v ? "Nhập vị trí sử dụng" : null),
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Phiếu sử dụng vật tư:", values);
    // TODO: gửi dữ liệu lên backend hoặc cập nhật store
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu"
          placeholder="PU001"
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          label="Vật tư"
          placeholder="Chọn loại vật tư"
          data={materialOptions}
          radius={4}
          {...form.getInputProps("materialId")}
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            radius={4}
            {...form.getInputProps("startTime")}
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            radius={4}
            {...form.getInputProps("endTime")}
          />
        </Group>

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
        <TextInput
          label="Mục đích sử dụng"
          radius={4}
          placeholder="Ví dụ: Phun phân, rải phân, xử lý sâu bệnh..."
          {...form.getInputProps("purpose")}
        />

        <Textarea
          label="Vị trí sử dụng"
          radius={4}
          placeholder="Ví dụ: Vùng trồng A1, Khu đất 3, Lô 2 hàng 5..."
          autosize
          minRows={2}
          {...form.getInputProps("location")}
        />
        <Input.Wrapper label="Thông tin liên quan (hoá đơn/chứng từ)">
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
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
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
                label="Chọn vai trò"
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
          <EmployeeCardList />
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

export default AddMaterialUsageForm;

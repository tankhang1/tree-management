import {
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";

const EditProtocolModal = ({ opened, onClose, data }: any) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Chỉnh sửa thông tin phác đồ
        </Text>
      }
      size="lg"
      centered
      radius="md"
    >
      <Stack gap="md">
        <Grid>
          <Grid.Col span={8}>
            <TextInput label="Tên phác đồ" defaultValue={data.name} fw={500} />
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput label="Mã phác đồ" defaultValue={data.code} disabled />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              label="Trạng thái"
              defaultValue={data.status}
              data={[
                { value: "dang-ap-dung", label: "Đang áp dụng" },
                { value: "de-xuat", label: "Đề xuất" },
                { value: "luu-tru", label: "Lưu trữ" },
                { value: "tam-dung", label: "Tạm dừng" },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Mức độ nghiêm trọng"
              defaultValue={data.severity}
              data={[
                { value: "nhẹ", label: "Nhẹ" },
                { value: "trung-binh", label: "Trung bình" },
                { value: "nang", label: "Nghiêm trọng" },
              ]}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Chi phí ước tính (VNĐ/Ha)"
              defaultValue={data.estimatedCost}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Thời gian xử lý (Ngày)"
              defaultValue={data.durationDays}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Ghi chú an toàn bổ sung"
              autosize
              minRows={2}
              placeholder="Nhập ghi chú..."
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            color="teal"
            onClick={() => {
              alert("Đã lưu thay đổi thành công!");
              onClose();
            }}
          >
            Lưu thay đổi
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
export default EditProtocolModal;

import {
  Alert,
  Button,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconInfoCircle, IconShieldCheck } from "@tabler/icons-react";

const ApplyProtocolModal = ({ opened, onClose, data }: any) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconShieldCheck size={20} color="var(--mantine-color-teal-6)" />
          <Text fw={700} size="lg">
            Xác nhận áp dụng phác đồ
          </Text>
        </Group>
      }
      centered
      radius="md"
    >
      <Stack gap="md">
        <Alert
          variant="light"
          color="teal"
          title="Thông tin phác đồ"
          icon={<IconInfoCircle />}
        >
          Bạn đang áp dụng phác đồ <b>{data.name}</b> ({data.code}). <br />
          Thời gian dự kiến: <b>{data.durationDays} ngày</b>.
        </Alert>

        <Select
          label="Chọn khu vực áp dụng"
          placeholder="Chọn lô đất / vườn..."
          data={[
            "Lô A1 - Vườn Sầu Riêng (Đồng Nai)",
            "Lô B2 - Ruộng Lúa (Long An)",
            "Khu C - Vườn Cà Phê (Đắk Lắk)",
          ]}
          searchable
          required
        />

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              type="date"
              label="Ngày bắt đầu"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Người phụ trách" placeholder="Nhập tên..." />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Hủy
          </Button>
          <Button
            color="teal"
            onClick={() => {
              alert(`Đã kích hoạt phác đồ cho ${data.name}`);
              onClose();
            }}
          >
            Xác nhận áp dụng
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
export default ApplyProtocolModal;

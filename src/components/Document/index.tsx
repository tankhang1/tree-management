import { Group, Radio, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import SunEditor from "suneditor-react";

type TDocument = {
  title1?: string;
  title2?: string;
};
const Document = ({
  title1 = "Tài liệu kỹ thuật",
  title2 = "Nội dung kỹ thuật",
}: TDocument) => {
  const [type, setType] = useState("0");
  return (
    <Stack gap={"xs"}>
      <Radio.Group label={title1} onChange={setType}>
        <Group mt="xs">
          <Radio value="0" label="Tải file PDF" />
          <Radio value="1" label="Tài liệu kỹ thuật" />
        </Group>
      </Radio.Group>

      {type === "0" ? (
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
      ) : (
        <Stack>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>{title2}</Text>
          <SunEditor setOptions={{ height: "200px" }} />
        </Stack>
      )}
    </Stack>
  );
};

export default Document;

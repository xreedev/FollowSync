import { FormControl, FormLabel, Input} from '@chakra-ui/react'
function UserNameInput() {
    return (
      <FormControl isRequired>
  <FormLabel>Enter your Instagram username</FormLabel>
  <Input placeholder='username' />
</FormControl>
    )}
export default UserNameInput;


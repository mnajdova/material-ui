import { ownerDocument } from '@material-ui/utils';

export default function ownerWindow(node: Node | undefined): Window {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}

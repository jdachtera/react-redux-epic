import { hydrate as _hydrate, unmountComponentAtNode } from 'react-dom';
import { Observable } from 'rxjs';

// render(
//   element: ReactElement,
//   container: DOMElement,
// ) => Observable[RootInstance]

export default function render(element, container) {
  return Observable.create(observer => {
    try {
      _hydrate(element, container, function() {
        observer.next();
      });
    } catch (err) {
      return observer.error(err);
    }

    return () => unmountComponentAtNode(container);
  });
}

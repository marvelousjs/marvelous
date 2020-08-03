import * as assert from 'assert';

import { removeEmpty } from '../utils';

describe('removeEmpty', () => {
  it('should remove undefined properties from object', () => {
    const oldObject: {
      firstName: string;
      lastName: string;
    } = {
      firstName: 'Test',
      lastName: undefined
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      firstName: 'Test',
      lastName: undefined
    });

    assert.deepStrictEqual(newObject, {
      firstName: 'Test'
    });
  });

  it('should remove null properties from object', () => {
    const oldObject: {
      firstName: string;
      lastName: string;
    } = {
      firstName: 'Test',
      lastName: null
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      firstName: 'Test',
      lastName: null
    });

    assert.deepStrictEqual(newObject, {
      firstName: 'Test'
    });
  });

  it('should remove undefined properties from nested object', () => {
    const oldObject: {
      person: {
        firstName: string;
        lastName: string;
      };
    } = {
      person: {
        firstName: 'Test',
        lastName: undefined
      }
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      person: {
        firstName: 'Test',
        lastName: undefined
      }
    });

    assert.deepStrictEqual(newObject, {
      person: {
        firstName: 'Test'
      }
    });
  });

  it('should remove null properties from nested object', () => {
    const oldObject: {
      person: {
        firstName: string;
        lastName: string;
      };
    } = {
      person: {
        firstName: 'Test',
        lastName: null
      }
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      person: {
        firstName: 'Test',
        lastName: null
      }
    });

    assert.deepStrictEqual(newObject, {
      person: {
        firstName: 'Test'
      }
    });
  });

  it('should remove undefined properties from arrays', () => {
    const oldObject: {
      people: string[];
    } = {
      people: ['Test', undefined]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: ['Test', undefined]
    });

    assert.deepStrictEqual(newObject, {
      people: ['Test']
    });
  });

  it('should remove null properties from arrays', () => {
    const oldObject: {
      people: string[];
    } = {
      people: ['Test', null]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: ['Test', null]
    });

    assert.deepStrictEqual(newObject, {
      people: ['Test']
    });
  });

  it('should remove undefined properties from array of objects', () => {
    const oldObject: {
      people: {
        firstName: string;
        lastName: string;
      }[];
    } = {
      people: [
        {
          firstName: 'Test',
          lastName: undefined
        }
      ]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: [
        {
          firstName: 'Test',
          lastName: undefined
        }
      ]
    });

    assert.deepStrictEqual(newObject, {
      people: [
        {
          firstName: 'Test'
        }
      ]
    });
  });

  it('should remove null properties from array of objects', () => {
    const oldObject: {
      people: {
        firstName: string;
        lastName: string;
      }[];
    } = {
      people: [
        {
          firstName: 'Test',
          lastName: null
        }
      ]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: [
        {
          firstName: 'Test',
          lastName: null
        }
      ]
    });

    assert.deepStrictEqual(newObject, {
      people: [
        {
          firstName: 'Test'
        }
      ]
    });
  });

  it('should remove undefined properties from array of arrays', () => {
    const oldObject: {
      people: string[][];
    } = {
      people: [['Test', undefined]]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: [['Test', undefined]]
    });

    assert.deepStrictEqual(newObject, {
      people: [['Test']]
    });
  });

  it('should remove null properties from array of arrays', () => {
    const oldObject: {
      people: string[][];
    } = {
      people: [['Test', null]]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: [['Test', null]]
    });

    assert.deepStrictEqual(newObject, {
      people: [['Test']]
    });
  });

  it('should remove undefined properties from array of array of objects', () => {
    const oldObject: {
      people: {
        firstName: string;
        lastName: string;
      }[][];
    } = {
      people: [
        [
          {
            firstName: 'Test',
            lastName: undefined
          }
        ]
      ]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: [
        [
          {
            firstName: 'Test',
            lastName: undefined
          }
        ]
      ]
    });

    assert.deepStrictEqual(newObject, {
      people: [
        [
          {
            firstName: 'Test'
          }
        ]
      ]
    });
  });

  it('should remove null properties from array of array of objects', () => {
    const oldObject: {
      people: {
        firstName: string;
        lastName: string;
      }[][];
    } = {
      people: [
        [
          {
            firstName: 'Test',
            lastName: null
          }
        ]
      ]
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      people: [
        [
          {
            firstName: 'Test',
            lastName: null
          }
        ]
      ]
    });

    assert.deepStrictEqual(newObject, {
      people: [
        [
          {
            firstName: 'Test'
          }
        ]
      ]
    });
  });

  it('should ignore buffers', () => {
    const oldObject: {
      image: Buffer;
    } = {
      image: Buffer.from('abc', 'base64')
    };

    const newObject = removeEmpty(oldObject);

    assert.deepStrictEqual(oldObject, {
      image: Buffer.from('abc', 'base64')
    });

    assert.deepStrictEqual(newObject, {
      image: Buffer.from('abc', 'base64')
    });
  });
});

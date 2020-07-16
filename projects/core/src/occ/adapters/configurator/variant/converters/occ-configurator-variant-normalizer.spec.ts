import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TranslationService } from '../../../../../i18n/translation.service';
import { Configurator } from '../../../../../model/configurator.model';
import { ConverterService } from '../../../../../util/converter.service';
import { OccConfig } from '../../../../config/occ-config';
import { OccConfigurator } from '../occ-configurator.models';
import { OccConfiguratorVariantNormalizer } from './occ-configurator-variant-normalizer';

const attributeName = 'name';
const valueKey = 'BK';
const valueName = 'Black';
const valueKey2 = 'BE';
const selectedFlag = true;
const requiredFlag = true;
const generalGroupName = '_GEN';
const generalGroupDescription = 'General';
const groupName = 'GROUP1';
const groupDescription = 'The Group Name';
let flatGroups: Configurator.Group[] = [];
let groups: Configurator.Group[] = [];

const occImage: OccConfigurator.Image = {
  altText: 'Alternate Text for Image',
  format: OccConfigurator.ImageFormatType.VALUE_IMAGE,
  imageType: OccConfigurator.ImageType.PRIMARY,
  url: 'media?This%20%is%20%a%20%URL',
};

const occAttribute: OccConfigurator.Attribute = {
  name: attributeName,
  images: [occImage],
};
const occAttributeWithValues: OccConfigurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  type: OccConfigurator.UiType.RADIO_BUTTON,
  domainValues: [
    { key: valueKey, images: [occImage] },
    { key: valueKey2, selected: selectedFlag },
  ],
};
const attributeRBWithValues: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.RADIOBUTTON,
  selectedSingleValue: 'SomeValue',
};
const attributeRBWoValues: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.RADIOBUTTON,
  selectedSingleValue: '',
};
const attributeDDWithValues: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.DROPDOWN,
  selectedSingleValue: 'SomeValue',
};
const attributeDDWoValues: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.DROPDOWN,
  selectedSingleValue: '',
};
const attributeSSIWithValues: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.SINGLE_SELECTION_IMAGE,
  selectedSingleValue: 'SomeValue',
};
const attributeSSIWoValues: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.SINGLE_SELECTION_IMAGE,
  selectedSingleValue: '',
};
const attributeStringWoValue: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.STRING,
};
const attributeStringWithValue: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.STRING,
  userInput: 'SomeValue',
};
const attributeCheckboxWOValue: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.CHECKBOXLIST,
  values: [
    {
      name: 'name1',
      selected: false,
    },
    {
      name: 'name2',
      selected: false,
    },
  ],
};
const attributeCheckboxWithValue: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.CHECKBOXLIST,
  values: [
    {
      name: 'name1',
      selected: true,
    },
    {
      name: 'name2',
      selected: false,
    },
  ],
};
const attributeMSIWOValue: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.MULTI_SELECTION_IMAGE,
  values: [
    {
      name: 'name1',
      selected: false,
    },
    {
      name: 'name2',
      selected: false,
    },
  ],
};
const attributeMSIWithValue: Configurator.Attribute = {
  name: attributeName,
  required: requiredFlag,
  uiType: Configurator.UiType.MULTI_SELECTION_IMAGE,
  values: [
    {
      name: 'name1',
      selected: true,
    },
    {
      name: 'name2',
      selected: false,
    },
  ],
};
const configuration: OccConfigurator.Configuration = {
  complete: true,
  rootProduct: 'CONF_PRODUCT',
  groups: [
    {
      attributes: [occAttributeWithValues],
      subGroups: [{ attributes: [occAttributeWithValues] }],
    },
    {
      attributes: [occAttributeWithValues],
    },
  ],
};

const group: OccConfigurator.Group = {
  name: groupName,
  description: groupDescription,
  attributes: [occAttributeWithValues],
};

const occValue: OccConfigurator.Value = {
  key: valueKey,
  langDepName: valueName,
};

class MockConverterService {
  convert() {}
}

class MockTranslationService {
  translate(): Observable<string> {
    return of(generalGroupDescription);
  }
}

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: 'https://occBackendBaseUrl/',
      prefix: '',
    },
    media: {
      baseUrl: 'https://mediaBackendBaseUrl/',
    },
  },
};

describe('OccConfiguratorVariantNormalizer', () => {
  let occConfiguratorVariantNormalizer: OccConfiguratorVariantNormalizer;
  let occConfig: OccConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccConfiguratorVariantNormalizer,
        { provide: ConverterService, useClass: MockConverterService },
        { provide: OccConfig, useValue: MockOccModuleConfig },
        { provide: TranslationService, useClass: MockTranslationService },
      ],
    });

    occConfiguratorVariantNormalizer = TestBed.inject(
      OccConfiguratorVariantNormalizer as Type<OccConfiguratorVariantNormalizer>
    );
    occConfig = TestBed.inject(OccConfig as Type<OccConfig>);
    groups = [];
    flatGroups = [];
  });

  it('should be created', () => {
    expect(occConfiguratorVariantNormalizer).toBeTruthy();
  });

  it('should convert a configuration', () => {
    const result = occConfiguratorVariantNormalizer.convert(configuration);
    expect(result.complete).toBe(true);
  });

  it('should not touch isRequiredCartUpdate and isCartEntryUpdatePending when converting a configuration', () => {
    const result: Configurator.Configuration = occConfiguratorVariantNormalizer.convert(
      configuration
    );
    expect(result.isCartEntryUpdateRequired).toBeUndefined();
  });

  it('should convert subgroups', () => {
    const result = occConfiguratorVariantNormalizer.convert(configuration);
    expect(result.groups[0].subGroups[0].attributes.length).toBe(1);
  });

  it('should convert empty subgroups to empty array', () => {
    const result = occConfiguratorVariantNormalizer.convert(configuration);
    expect(result.groups[1].subGroups.length).toBe(0);
  });

  it('should convert attributes and values', () => {
    const result = occConfiguratorVariantNormalizer.convert(configuration);
    const attributes = result.groups[0].attributes;
    expect(attributes).toBeDefined();
    expect(attributes.length).toBe(1);
    const attribute = attributes[0];
    expect(attribute.name).toBe(attributeName);
    expect(attribute.required).toBe(requiredFlag);
    expect(attribute.selectedSingleValue).toBe(valueKey2);
    expect(attribute.uiType).toBe(Configurator.UiType.RADIOBUTTON);
    const values = attribute.values;
    expect(values.length).toBe(2);
  });

  it('should convert values', () => {
    const values: Configurator.Value[] = [];
    occConfiguratorVariantNormalizer.convertValue(occValue, values);
    expect(values.length).toBe(1);
    expect(values[0].valueCode).toBe(valueKey);
  });

  it('should convert attributes and do not complain if no domain values are present', () => {
    const attributes: Configurator.Attribute[] = [];
    occConfiguratorVariantNormalizer.convertAttribute(occAttribute, attributes);
    expect(attributes.length).toBe(1);
    expect(attributes[0].name).toBe(attributeName);
  });

  it('should tell if attribute is numeric and know if negative values are allowed', () => {
    const attributes: Configurator.Attribute[] = [];
    const numericOccAttribute: OccConfigurator.Attribute = {
      value: '23.234',
      negativeAllowed: true,
      type: OccConfigurator.UiType.READ_ONLY,
    };
    occConfiguratorVariantNormalizer.convertAttribute(
      numericOccAttribute,
      attributes
    );

    expect(attributes[0].negativeAllowed).toBe(true);
  });

  it('should increase maximum length if negative numbers are allowed', () => {
    const attributes: Configurator.Attribute[] = [];
    const numericOccAttribute: OccConfigurator.Attribute = {
      maxlength: 3,
      negativeAllowed: true,
    };
    occConfiguratorVariantNormalizer.convertAttribute(
      numericOccAttribute,
      attributes
    );

    expect(attributes[0].maxlength).toBe(numericOccAttribute.maxlength + 1);
  });

  it('should convert a standard group', () => {
    occConfiguratorVariantNormalizer.convertGroup(group, groups, flatGroups);
    expect(groups[0].description).toBe(groupDescription);
  });

  it('should convert a group with no attributes', () => {
    const groupsWithoutAttributes: OccConfigurator.Group = {
      name: groupName,
    };

    occConfiguratorVariantNormalizer.convertGroup(
      groupsWithoutAttributes,
      groups,
      flatGroups
    );
    expect(groups[0].name).toBe(groupName);
  });

  it('should convert a general group', () => {
    const generalGroup: OccConfigurator.Group = {
      name: generalGroupName,
    };

    occConfiguratorVariantNormalizer.convertGroup(
      generalGroup,
      groups,
      flatGroups
    );
    expect(groups[0].description).toBe(generalGroupDescription);
  });

  it('should set description for a general group', () => {
    const generalGroup: Configurator.Group = {
      name: generalGroupName,
    };

    occConfiguratorVariantNormalizer.setGeneralDescription(generalGroup);
    expect(generalGroup.description).toBe(generalGroupDescription);
  });

  it('should set selectedSingleValue', () => {
    const configAttribute: Configurator.Attribute = {
      name: attributeName,
      values: [
        { valueCode: valueKey },
        { valueCode: valueKey2, selected: selectedFlag },
      ],
    };
    occConfiguratorVariantNormalizer.setSelectedSingleValue(configAttribute);
    expect(configAttribute.selectedSingleValue).toBe(valueKey2);
  });

  it('should not set selectedSingleValue for multi-valued attributes', () => {
    const configAttribute: Configurator.Attribute = {
      name: attributeName,
      values: [
        { valueCode: valueKey, selected: selectedFlag },
        { valueCode: valueKey2, selected: selectedFlag },
      ],
    };
    occConfiguratorVariantNormalizer.setSelectedSingleValue(configAttribute);
    expect(configAttribute.selectedSingleValue).toBeUndefined();
  });

  it('should return UIType Radio Button for Radio Button occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.RADIO_BUTTON
      )
    ).toBe(Configurator.UiType.RADIOBUTTON);
  });

  it('should convert numeric attribute type correctly', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.NUMERIC
      )
    ).toBe(Configurator.UiType.NUMERIC);
  });

  it('should convert read-only attribute type correctly', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.READ_ONLY
      )
    ).toBe(Configurator.UiType.READ_ONLY);
  });

  it('should return UIType Drop Down for Drop Down occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.DROPDOWN
      )
    ).toBe(Configurator.UiType.DROPDOWN);
  });

  it('should return UIType Checkbox for Checkbox occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.CHECK_BOX_LIST
      )
    ).toBe(Configurator.UiType.CHECKBOXLIST);
  });

  it('should return UIType Checkbox for Checkbox occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.SINGLE_SELECTION_IMAGE
      )
    ).toBe(Configurator.UiType.SINGLE_SELECTION_IMAGE);
  });

  it('should return UIType String for String occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.STRING
      )
    ).toBe(Configurator.UiType.STRING);
  });

  it('should return UIType checkox for checkbox occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.CHECK_BOX
      )
    ).toBe(Configurator.UiType.CHECKBOX);
  });

  it('should return UIType multi selection image for corresponding occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.MULTI_SELECTION_IMAGE
      )
    ).toBe(Configurator.UiType.MULTI_SELECTION_IMAGE);
  });

  it('should return UIType Not Implemented for unkonwn occ configurator type', () => {
    expect(
      occConfiguratorVariantNormalizer.convertAttributeType(
        OccConfigurator.UiType.DROPDOWN_ADDITIONAL_INPUT
      )
    ).toBe(Configurator.UiType.NOT_IMPLEMENTED);
  });

  it('should convert group types properly', () => {
    expect(
      occConfiguratorVariantNormalizer.convertGroupType(
        OccConfigurator.GroupType.CSTIC_GROUP
      )
    ).toBe(Configurator.GroupType.ATTRIBUTE_GROUP);

    expect(
      occConfiguratorVariantNormalizer.convertGroupType(
        OccConfigurator.GroupType.INSTANCE
      )
    ).toBe(Configurator.GroupType.SUB_ITEM_GROUP);
  });

  it('should convert image with media URL configured', () => {
    const images = [];

    occConfiguratorVariantNormalizer.convertImage(occImage, images);

    expect(images.length).toBe(1);
    expect(images[0].url).toBe(
      'https://mediaBackendBaseUrl/media?This%20%is%20%a%20%URL'
    );

    occConfiguratorVariantNormalizer.convertImage(occImage, images);
    expect(images.length).toBe(2);
  });

  it('should convert image with no media URL configured', () => {
    const images = [];
    occConfig.backend.media.baseUrl = null;

    occConfiguratorVariantNormalizer.convertImage(occImage, images);

    expect(images.length).toBe(1);
    expect(images[0].url).toBe(
      'https://occBackendBaseUrl/media?This%20%is%20%a%20%URL'
    );
  });

  describe('check the setting of incomplete', () => {
    it('should set incomplete by string type correctly', () => {
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeStringWoValue
      );
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeStringWithValue
      );

      expect(attributeStringWoValue.incomplete).toBe(true);
      expect(attributeStringWithValue.incomplete).toBe(false);
    });

    it('should set incomplete by radio button type correctly', () => {
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeRBWoValues
      );
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeRBWithValues
      );

      expect(attributeRBWoValues.incomplete).toBe(true);
      expect(attributeRBWithValues.incomplete).toBe(false);
    });

    it('should set incomplete by drop-down type correctly', () => {
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeDDWoValues
      );
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeDDWithValues
      );

      expect(attributeDDWoValues.incomplete).toBe(true);
      expect(attributeDDWithValues.incomplete).toBe(false);
    });

    it('should set incomplete by single-selection-image type correctly', () => {
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeSSIWoValues
      );
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeSSIWithValues
      );

      expect(attributeSSIWoValues.incomplete).toBe(true);
      expect(attributeSSIWithValues.incomplete).toBe(false);
    });

    it('should set incomplete by checkbox type correctly', () => {
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeCheckboxWOValue
      );
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeCheckboxWithValue
      );

      expect(attributeCheckboxWOValue.incomplete).toBe(true);
      expect(attributeCheckboxWithValue.incomplete).toBe(false);
    });

    it('should set incomplete by multi-selection-image type correctly', () => {
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeMSIWOValue
      );
      occConfiguratorVariantNormalizer.compileAttributeIncomplete(
        attributeMSIWithValue
      );

      expect(attributeMSIWOValue.incomplete).toBe(true);
      expect(attributeMSIWithValue.incomplete).toBe(false);
    });
  });
});

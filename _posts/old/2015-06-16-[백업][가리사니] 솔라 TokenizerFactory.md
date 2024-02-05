---
layout: post
tags: [solr]
---

> 이 문서는 가리사니 개발자 포럼에 올렸던 글의 백업 파일입니다.
오래된 문서가 많아 현재 상황과 맞지 않을 수 있습니다.



출처는 아래와 같습니다.
https://cwiki.apache.org/confluence/display/solr/Tokenizers


solr.StandardTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.StandardTokenizerFactory"/>
</analyzer>
```

solr.ClassicTokenizerFactory
``` java
<fieldType name="text" class="solr.TextField">
    <analyzer type="index">
        <tokenizer class="solr.StandardTokenizerFactory"/>
        <filter class="solr.StandardFilterFactory"/>
    </analyzer>
</fieldType>
```

solr.KeywordTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.KeywordTokenizerFactory"/>
</analyzer>
```

solr.LetterTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.LetterTokenizerFactory"/>
</analyzer>
```

solr.LowerCaseTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.LowerCaseTokenizerFactory"/>
</analyzer>
```

solr.NGramTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.NGramTokenizerFactory"/>
</analyzer>
```
``` java
<analyzer>
  <tokenizer class="solr.NGramTokenizerFactory" minGramSize="4" maxGramSize="5"/>
</analyzer>
```

solr.EdgeNGramTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.EdgeNGramTokenizerFactory" minGramSize="2" maxGramSize="5"/>
</analyzer>
```

solr.ICUTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.ICUTokenizerFactory"
  rulefiles="Latn:my.Latin.rules.rbbi,Cyrl:my.Cyrillic.rules.rbbi"
/>
</analyzer>
```

solr.PathHierarchyTokenizerFactory
``` java
<fieldType name="text_path" class="solr.TextField" positionIncrementGap="100">
  <analyzer>
    <tokenizer class="solr.PathHierarchyTokenizerFactory" delimiter="\" replace="/"/>
  </analyzer>
</fieldType>
```

solr.PatternTokenizerFactory
``` java
<fieldType name="semicolonDelimited" class="solr.TextField">
  <analyzer type="query">
    <tokenizer class="solr.PatternTokenizerFactory" pattern="; "/>
  </analyzer>
</fieldType>
```
``` java
<analyzer>
  <tokenizer class="solr.PatternTokenizerFactory" pattern="\s*,\s*"/>
</analyzer>
```

solr.UAX29URLEmailTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.UAX29URLEmailTokenizerFactory"/>
</analyzer>
```

solr.WhitespaceTokenizerFactory
``` java
<analyzer>
  <tokenizer class="solr.WhitespaceTokenizerFactory"/>
</analyzer>
```
